import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Booking, Vehicle} from "./models";
import {filter} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private http: HttpClient) {

  }

  getBookings() {
    return this.http.get<Booking[]>('/api/bookings/');
  }

  getBookingsBy(person: number) {
    return this.http.get<Booking[]>(`/api/bookings/?bookedBy=${person}`);
  }

  getBookingsFrom(person: number) {
    return this.http.get<Booking[]>(`/api/bookings/?bookedFrom=${person}`);
  }

  update(booking: Booking, pk: number) {
    return this.http.put(`/api/bookings/${pk}`+'/', booking);
  }

  create(booking: Booking) {
    return this.http.post('/api/bookings/', booking);
  }

  delete(booking: Booking) {
    return this.http.delete(`/api/bookings/${booking.id}`);
  }
}
