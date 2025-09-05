import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { Country } from "../models/country.model"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class CountriesService {
  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http
      .get<Country[]>(`${environment.countriesApiUrl}/all`)
      .pipe(map((countries) => countries.sort((a, b) => a.name.common.localeCompare(b.name.common))))
  }

  getCountryByCode(code: string): Observable<Country> {
    return this.http
      .get<Country[]>(`${environment.countriesApiUrl}/alpha/${code}`)
      .pipe(map((countries) => countries[0]))
  }
}
