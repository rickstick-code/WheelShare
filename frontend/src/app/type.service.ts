

import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Type} from "./models";
import {environment} from "./environment";


@Injectable({
  providedIn: 'root'
})
export class TypeService {
  constructor(private http: HttpClient) {

  }

  getTypes() {
    return this.http.get<Type[]>(`${environment.apiBaseUrl}/types/`);
  }

  getType(pk: number) {
    return this.http.get<Type[]>(`${environment.apiBaseUrl}/types/`+pk+'/');
  }
}
