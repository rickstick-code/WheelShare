import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { VehicleService } from "../vehicle.service";
import { TypeService } from "../type.service";
import { UserService } from "../services/user.service";
import { Type, User } from "../models";

@Component({
  selector: 'app-vehicle-new',
  templateUrl: './vehicle-new.component.html',
  styleUrls: ['./vehicle-new.component.scss']
})
export class VehicleNewComponent implements OnInit {
  vehicleFormGroup: FormGroup;
  typeOptions: Type[] = [];
  userOptions: User[] = [];
  apiKey: string = '4oaTVIMMIiHxU5NOe0mb'; // Replace with your actual API key

  constructor(
    private userService: UserService,
    private vehicleService: VehicleService,
    private typeService: TypeService,
    private router: Router,
    private http: HttpClient // Add HttpClient
  ) {
    this.vehicleFormGroup = new FormGroup({
      model: new FormControl(''),
      number_of_seats: new FormControl(''),
      vignette: new FormControl(false),
      type: new FormControl([]),
      comment: new FormControl(''),
      owner: new FormControl([]),
      address: new FormControl('') // Add address form control
    });
  }

  ngOnInit(): void {
    this.userService.getUsers()
      .subscribe(users => this.userOptions = users);

    this.typeService.getTypes()
      .subscribe(types => this.typeOptions = types);
  }

  getCoordinates(address: string) {
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => response.features[0]?.geometry.coordinates || [0, 0])
    );
  }

  createVehicle() {
    const newVehicle = this.vehicleFormGroup.value;

    // Convert address to coordinates before sending to server
    if (newVehicle.address) {
      this.getCoordinates(newVehicle.address).subscribe(coordinates => {
        // Assuming your vehicle model has latitude and longitude properties
        newVehicle.lan = coordinates[1];
        newVehicle.lon = coordinates[0];
        delete newVehicle.address; // Remove address property if not needed on server

        this.vehicleService.create(newVehicle).subscribe(
          () => this.router.navigate(['/vehicles-list']),
          error => alert(`Error: ${error.message}`)
        );
      });
    } else {
      this.vehicleService.create(newVehicle).subscribe(
        () => this.router.navigate(['/vehicles-list']),
        error => alert(`Error: ${error.message}`)
      );
    }
  }
}
