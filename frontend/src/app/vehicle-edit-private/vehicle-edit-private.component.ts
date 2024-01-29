import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import {Type, User} from "../models";
import { VehicleService } from "../vehicle.service";
import { TypeService } from "../type.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-vehicle-edit-private',
  templateUrl: './vehicle-edit-private.component.html',
  styleUrls: ['./vehicle-edit-private.component.scss']
})
export class VehicleEditPrivateComponent implements OnInit {
  pk!: number;
  vehicleFormGroup: FormGroup;
  typeOptions: Type[] = [];
  originalOwner!: number[];
  apiKey: string = '4oaTVIMMIiHxU5NOe0mb';

  constructor(
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
      address: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.typeService.getTypes().subscribe(types => this.typeOptions = types);

    this.pk = Number(this.route.snapshot.paramMap.get('pk'));
    if (this.pk) {
      this.vehicleService.getVehicle(this.pk).subscribe(vehicle => {
        this.originalOwner = vehicle.owner; // Store the original owner

        this.vehicleFormGroup.patchValue({
          ...vehicle,
          owner: undefined // Remove owner from form patching
        });

        if (vehicle.lan && vehicle.lon) {
          this.getLocationName(vehicle.lon, vehicle.lan).subscribe(address => {
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
      const updatedVehicle = {
        ...this.vehicleFormGroup.value,
        owner: this.originalOwner // Include the original owner in the update
      };

      if (updatedVehicle.address) {
        this.getCoordinates(updatedVehicle.address).subscribe(coordinates => {
          updatedVehicle.lan = coordinates[1];
          updatedVehicle.lon = coordinates[0];

          this.vehicleService.update(updatedVehicle, this.pk).subscribe(() => {
            this.router.navigate(['/vehicles-list-private']);
          });
        });
      } else {
        this.vehicleService.update(updatedVehicle, this.pk).subscribe(() => {
          this.router.navigate(['/vehicles-list-private']);
        });
      }
    } else {
      alert("Warning: No ID Found!");
    }
  }

  onAddressChange() {
    const address = this.vehicleFormGroup.get('address')?.value;
    if (address) {
      this.getCoordinates(address).subscribe(coordinates => {
        console.log('Coordinates:', coordinates);
      });
    }
  }
}
