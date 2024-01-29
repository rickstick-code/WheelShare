import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UserService } from "../services/user.service";
import { VehicleService } from "../vehicle.service";
import { TypeService } from "../type.service";
import { Type, User } from "../models";

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.scss']
})
export class VehicleEditComponent implements OnInit {
  pk!: number;
  vehicleFormGroup: FormGroup;
  typeOptions: Type[] = [];
  userOptions: User[] = [];
  apiKey: string = '4oaTVIMMIiHxU5NOe0mb'; // Replace with your actual API key

  constructor(
    private userService: UserService,
    private vehicleService: VehicleService,
    private typeService: TypeService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
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

    this.pk = Number(this.route.snapshot.paramMap.get('pk'));
    if (this.pk) {
      this.vehicleService.getVehicle(this.pk).subscribe(vehicle => {
        this.vehicleFormGroup.patchValue({
          ...vehicle
        });
        // Assuming vehicle has latitude and longitude properties
        if (vehicle.lan && vehicle.lon) {
          this.getLocationName(vehicle.lon, vehicle.lan)
            .subscribe(address => {
              this.vehicleFormGroup.patchValue({ address });
            });
        }
      });
    } else {
      alert("Warning: No ID Found!");
    }
  }

  getLocationName(lon: number, lat: number) {
    const url = `https://api.maptiler.com/geocoding/${lon},${lat}.json?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => response.features[0]?.place_name || 'Not found')
    );
  }

  getCoordinates(address: string) {
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => response.features[0]?.center || [0, 0])
    );
  }

  updateVehicle() {
    if (this.pk) {
      const updatedVehicle = this.vehicleFormGroup.value;

      // If address field is updated, convert it to coordinates
      if (updatedVehicle.address) {
        this.getCoordinates(updatedVehicle.address).subscribe(coordinates => {
          // Assuming your vehicle model has latitude and longitude properties
          updatedVehicle.lan = coordinates[1];
          updatedVehicle.lon = coordinates[0];

          this.vehicleService.update(updatedVehicle, this.pk).subscribe(() => {
            this.router.navigate(['/vehicles-list']);
          });
        });
      } else {
        this.vehicleService.update(updatedVehicle, this.pk).subscribe(() => {
          this.router.navigate(['/vehicles-list']);
        });
      }
    } else {
      alert("Warning: No ID Found!");
    }
  }

  // Optional: Method to handle address field change
  onAddressChange() {
    const address = this.vehicleFormGroup.get('address')?.value;
    if (address) {
      this.getCoordinates(address).subscribe(coordinates => {
        console.log('Coordinates:', coordinates); // Here you can handle the coordinates as needed
      });
    }
  }
}
