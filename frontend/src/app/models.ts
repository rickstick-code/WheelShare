import {AbstractControl, FormControl, FormGroup} from "@angular/forms";

export interface KeyValueItem {
  pk: number;
  name: string;
}

export interface Type {
  pk: number;
  name: string;
}

export interface Vehicle {
  pk: number;
  model: string,
  number_of_seats: number,
  vignette: boolean,
  comment: string,
  type: Type[],
  owner : number[],
  lon : number,
  lan : number
}

export interface User {
  pk: number;
  username: string;
  email: string;
  address: string;
  phone_number: string;
  //profile_image: string;
}

export interface Booking {
  id: number;
  vehicle: number[];
  person_that_books: number[];
  approved: boolean;
  info: string;
  price: string;
}

export type FormModel<T> = FormGroup<
  { [K in keyof T]: FormControl<T[K]> }
>;

// const test: FormModel<Movie>={‘black_and_white: new FormControl<boolean>(false)}
