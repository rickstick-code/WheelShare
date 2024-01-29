import {KeyValueItem} from "../models";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../environment";

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  constructor(private http: HttpClient) {

  }

  getCountries() {
    return this.http.get<KeyValueItem[]>(`${environment.apiBaseUrl}/countries/`);
  }
}
