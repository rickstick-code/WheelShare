import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { Type } from "../models";
import { UserService } from "../services/user.service";
import { VehicleService } from "../vehicle.service";
import { TypeService } from "../type.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-vehicle-new-private',
  templateUrl: './vehicle-new-private.component.html',
  styleUrls: ['./vehicle-new-private.component.scss']
})
export class VehicleNewPrivateComponent implements OnInit {
  vehicleFormGroup: FormGroup;
  typeOptions: Type[] = [];
  apiKey: string = '4oaTVIMMIiHxU5NOe0mb'; // Replace with your actual API key

  constructor(
    private userService: UserService,
    private vehicleService: VehicleService,
    private typeService: TypeService,
    private router: Router,
    private http: HttpClient
  ) {
    this.vehicleFormGroup = new FormGroup({
      model: new FormControl(''),
      number_of_seats: new FormControl(''),
      vignette: new FormControl(false),
      type: new FormControl([]),
      comment: new FormControl(''),
      address: new FormControl(userService.currentUser.address) // Add address form control
    });
  }

  ngOnInit(): void {
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

    // Get the current user's PK and set it as the only entry in the owner array
    const currentUserPk = this.userService.getCurrentUserPk();
    newVehicle.owner = [currentUserPk]; // Set the owner as an array

    // Convert address to coordinates before sending to server
    if (newVehicle.address) {
      this.getCoordinates(newVehicle.address).subscribe(coordinates => {
        newVehicle.lan = coordinates[1];
        newVehicle.lon = coordinates[0];
        delete newVehicle.address; // Remove address property if not needed on server

        this.vehicleService.create(newVehicle).subscribe(
          () => this.router.navigate(['/vehicles-list-private']),
          error => alert(`Error: ${error.message}`)
        );
      });
    } else {
      this.vehicleService.create(newVehicle).subscribe(
        () => this.router.navigate(['/vehicles-list-private']),
        error => alert(`Error: ${error.message}`)
      );
    }
  }
}
