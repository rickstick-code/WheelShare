import { Injectable } from '@angular/core';
import {KeyValueItem} from "../models";
import {environment} from "../environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(private http: HttpClient) { }

  getGenres() {
    return this.http.get<KeyValueItem[]>(`${environment.apiBaseUrl}/genres/`);
  }
}
