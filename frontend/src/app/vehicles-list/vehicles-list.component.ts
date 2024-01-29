import { Component, OnInit } from '@angular/core';
import { Vehicle } from "../models";
import { UserService } from "../services/user.service";
import { VehicleService } from "../vehicle.service";
import { TypeService } from "../type.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss']
})
export class VehiclesListComponent implements OnInit {
  private apiKey: string = '4oaTVIMMIiHxU5NOe0mb';
  vehicles!: Observable<Vehicle[]>; // Changed to Observable
  userMap: { [pk: number]: string } = {};
  displayedColumns = ['pk', 'model', 'number_of_seats', 'vignette', 'comment', 'type', 'owner', 'location', 'edit', 'delete'];

  constructor(public userService: UserService,
              public typeService: TypeService,
              public vehicleService: VehicleService,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.userService.checkAndNavigate()
    this.vehicles = this.vehicleService.getVehicles().pipe(
      map(vehicles => vehicles.map(vehicle => ({
        ...vehicle,
        locationName$: this.getLocationName(vehicle.lon, vehicle.lan)
      })))
    );

    this.userService.getUsers().subscribe(users => {
      users.forEach(user => {
        this.userMap[user.pk] = user.username;
      });
    });
  }



  getLocationName(lon: number, lat: number): Observable<string> {
    const url = `https://api.maptiler.com/geocoding/${lon},${lat}.json?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => response.features[0]?.place_name || 'Not found')
    );
  }

  getUsername(pk: number): string {
    return this.userMap[pk] || 'Unknown';
  }

  deleteVehicle(vehicle: Vehicle) {
    var userResponse = confirm("Are you sure you want to delete this vehicle?\n" +
      "This Change will not be reversible!");

    // Check the user's response
    if (userResponse) {
      this.vehicleService.delete(vehicle).subscribe(() => this.ngOnInit());
    }

  }
}
