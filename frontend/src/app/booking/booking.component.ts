import { Component } from '@angular/core';
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {Vehicle, Booking, User} from "../models";
import {VehicleService} from "../vehicle.service";
import {BookingsService} from "../bookings.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})

export class BookingComponent {
  pk: number | null = null;
  vehicle: Vehicle | null = null;
  booking: Booking;
  ownersInfo: User[] = []; // Array to store owners' information

  constructor(
    public userService: UserService,
    private vehicleService: VehicleService,
    private bookingsService: BookingsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.booking = {
      id: -1,
      vehicle: [],
      person_that_books: [],
      approved: false,
      info: '',
      price: '',
    };
  }

  ngOnInit(): void {
    this.pk = Number(this.route.snapshot.paramMap.get('pk'));
    if (this.pk) {
      this.vehicleService.getVehicle(this.pk).subscribe(vehicleData => {
        this.vehicle = vehicleData;
        this.fetchOwnersInfo(this.vehicle.owner); // Assuming 'owners' is an array of owner IDs
      });
    }
  }

  fetchOwnersInfo(ownerIds: number[]): void {
    if (ownerIds.length) {
      const ownerRequests = ownerIds.map(ownerId => this.userService.getUser(ownerId));
      forkJoin(ownerRequests).subscribe(results => {
        this.ownersInfo = results;
      });
    }
  }

  ngAfterViewInit(): void {
    this.booking.person_that_books = [this.userService.getCurrentUserPk()!];
  }

  goBack() {
    this.router.navigate(['/main-map']);
  }
  createBooking(): void {
    if (this.vehicle) {
      try {
        this.booking.vehicle = [this.vehicle.pk];
        this.booking.approved = false;
        this.bookingsService.create(this.booking).subscribe(() => {
          this.goBack();
        });
      } catch (error) {
        console.error('Error in createBooking:', error);
      }

    }
  }
}
