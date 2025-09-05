// services/countries.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { CountryOption } from '../models/country.model';

interface CountriesNowResponse {
  error: boolean;
  msg: string;
  data: Array<{ name: string; unicodeFlag: string; iso2: string; iso3: string }>;
}

@Injectable({ providedIn: 'root' })
export class CountriesService {
  constructor(private http: HttpClient) {}

  getCountries(): Observable<CountryOption[]> {
    return this.http.get<CountriesNowResponse>(environment.countriesApiUrl).pipe(
      map(res =>
        (res.data ?? []).map(c => ({
          id: c.name,
          value: `${c.unicodeFlag} ${c.name}`,
        }))
      )
    );
  }
}
