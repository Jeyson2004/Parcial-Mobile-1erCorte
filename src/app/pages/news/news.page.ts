import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  ToastController,
  InfiniteScrollCustomEvent,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NewsService } from '../../services/news.service';
import { AuthService } from '../../services/auth.service';
import { NewsArticle, NewsSearchParams } from '../../models/news.model';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit, OnDestroy {
  searchForm: FormGroup;
  articles: NewsArticle[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  totalResults = 0;
  hasMoreData = true;

  categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'business', label: 'Negocios' },
    { value: 'entertainment', label: 'Entretenimiento' },
    { value: 'general', label: 'General' },
    { value: 'health', label: 'Salud' },
    { value: 'science', label: 'Ciencia' },
    { value: 'sports', label: 'Deportes' },
    { value: 'technology', label: 'Tecnología' },
  ];

  sortOptions = [
    { value: 'publishedAt', label: 'Más recientes' },
    { value: 'popularity', label: 'Más populares' },
    { value: 'relevancy', label: 'Más relevantes' },
  ];

  private subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private newsService: NewsService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.searchForm = this.formBuilder.group({
      query: [''],
      category: [''],
      sortBy: ['publishedAt'],
    });
  }

  ngOnInit() {
    this.setupSubscriptions();
    this.loadTopHeadlines();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private setupSubscriptions() {
    this.subscriptions.add(
      this.newsService.loading$.subscribe((loading) => {
        this.loading = loading;
      })
    );

    this.subscriptions.add(
      this.newsService.error$.subscribe((error) => {
        this.error = error;
        if (error) {
          this.showErrorToast(error);
        }
      })
    );
  }

  loadTopHeadlines() {
    this.currentPage = 1;
    this.hasMoreData = true;
    this.articles = [];

    const params: NewsSearchParams = {
      country: 'us',
      pageSize: 20,
      page: this.currentPage,
    };

    const category = this.searchForm.get('category')?.value;
    if (category) {
      params.category = category;
    }

    this.newsService.getTopHeadlines(params).subscribe({
      next: (response) => {
        this.articles = response.articles;
        this.totalResults = response.totalResults;
        this.hasMoreData = response.articles.length === 20;
      },
      error: (error) => {
        console.error('Error loading headlines:', error);
      },
    });
  }

  searchNews() {
    const query = this.searchForm.get('query')?.value?.trim();

    if (!query) {
      this.loadTopHeadlines();
      return;
    }

    this.currentPage = 1;
    this.hasMoreData = true;
    this.articles = [];

    const params: NewsSearchParams = {
      q: query,
      sortBy: this.searchForm.get('sortBy')?.value || 'publishedAt',
      pageSize: 20,
      page: this.currentPage,
      language: 'en',
    };

    this.newsService.searchEverything(params).subscribe({
      next: (response) => {
        this.articles = response.articles;
        this.totalResults = response.totalResults;
        this.hasMoreData = response.articles.length === 20;

        if (response.articles.length === 0) {
          this.showNoResultsMessage();
        }
      },
      error: (error) => {
        console.error('Error searching news:', error);
      },
    });
  }

  public trackByUrl(index: number, article: NewsArticle): string | number {
    return article?.url ?? index;
  }

  loadMoreNews(event: InfiniteScrollCustomEvent) {
    if (!this.hasMoreData) {
      event.target.complete();
      return;
    }

    this.currentPage++;

    const query = this.searchForm.get('query')?.value?.trim();
    const category = this.searchForm.get('category')?.value;

    let params: NewsSearchParams;

    if (query) {
      params = {
        q: query,
        sortBy: this.searchForm.get('sortBy')?.value || 'publishedAt',
        pageSize: 20,
        page: this.currentPage,
        language: 'en',
      };
    } else {
      params = {
        country: 'us',
        pageSize: 20,
        page: this.currentPage,
      };
      if (category) {
        params.category = category;
      }
    }

    const apiCall = query
      ? this.newsService.searchEverything(params)
      : this.newsService.getTopHeadlines(params);

    apiCall.subscribe({
      next: (response) => {
        this.articles = [...this.articles, ...response.articles];
        this.hasMoreData = response.articles.length === 20;
        event.target.complete();
      },
      error: (error) => {
        console.error('Error loading more news:', error);
        event.target.complete();
      },
    });
  }

  openArticle(article: NewsArticle) {
    if (article.url) {
      window.open(article.url, '_blank');
    }
  }

  shareArticle(article: NewsArticle) {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.description || '',
          url: article.url,
        })
        .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(article.url).then(() => {
        this.showSuccessToast('Enlace copiado al portapapeles');
      });
    }
  }

  refreshNews(event: any) {
    this.loadTopHeadlines();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  clearSearch() {
    this.searchForm.patchValue({ query: '' });
    this.loadTopHeadlines();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/home']);
          },
        },
      ],
    });

    await alert.present();
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'top',
    });
    await toast.present();
  }

  private async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    await toast.present();
  }

  private async showNoResultsMessage() {
    const toast = await this.toastController.create({
      message: 'No se encontraron noticias para tu búsqueda',
      duration: 3000,
      color: 'warning',
      position: 'top',
    });
    await toast.present();
  }

  // Utility methods
  getTimeAgo(dateString: string): string {
    return this.newsService.getTimeAgo(dateString);
  }

  getImageUrl(article: NewsArticle): string {
    return article.urlToImage || '/news-placeholder.png';
  }

  getSourceName(article: NewsArticle): string {
    return article.source.name || 'Fuente desconocida';
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }
}

export default NewsPage;
