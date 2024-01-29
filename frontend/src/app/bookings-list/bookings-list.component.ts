import { Component } from '@angular/core';
import { Observable } from "rxjs";
import { Booking, Vehicle } from "../models";
import { UserService } from "../services/user.service";
import { TypeService } from "../type.service";
import { VehicleService } from "../vehicle.service";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { BookingsService } from "../bookings.service";

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.scss']
})
export class BookingsListComponent {
  bookingsForOthers!: Observable<Booking[]>; // Remains Observable
  bookingsFromOthers!: Observable<Booking[]>; // Added for the second table
  userMap: { [pk: number]: string } = {};
  vehicleMap: { [pk: number]: Vehicle } = {};
  displayedColumnsForOthers = ['pk', 'vehicle', 'person_that_booked', 'info', 'price', 'approved', 'delete'];
  displayedColumnsFromOthers = ['pk', 'vehicle', 'person_that_got_booked', 'info', 'price', 'approved'];

  constructor(public userService: UserService,
              public bookingsService: BookingsService,
              public typeService: TypeService,
              public vehicleService: VehicleService,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.bookingsForOthers = this.bookingsService.getBookingsFrom(this.userService.getCurrentUserPk()!).pipe(
      map(bookings => bookings.map(booking => ({
        ...booking,
      })))
    );

    this.bookingsFromOthers = this.bookingsService.getBookingsBy(this.userService.getCurrentUserPk()!).pipe(
      map(bookings => bookings.map(booking => ({
        ...booking,
      })))
    );

    this.userService.getUsers().subscribe(users => {
      users.forEach(user => {
        this.userMap[user.pk] = user.username;
      });
    });

    this.vehicleService.getVehicles().subscribe(vehicles => {
      vehicles.forEach(vehicle => {
        this.vehicleMap[vehicle.pk] = vehicle;
      });
    });
  }

  approveBooking(booking: Booking): void {
    const updatedBooking = { ...booking, approved: true };
    this.bookingsService.update(updatedBooking, booking.id).subscribe(() => this.ngOnInit());
  }

  getUsername(pk: number): string {
    return this.userMap[pk] || 'Unknown';
  }

  getVehicle(pk: number): Vehicle {
    return this.vehicleMap[pk];
  }

  getJoinedUsernames(element: any): string | null {
    if(element.vehicle == null){return null;}
    return this.getVehicle(element.vehicle)?.owner.map(t => this.getUsername(t)).join(', ') ?? null;
  }

  deleteBooking(booking: Booking) {
    this.bookingsService.delete(booking).subscribe(() => this.ngOnInit());
  }
}
