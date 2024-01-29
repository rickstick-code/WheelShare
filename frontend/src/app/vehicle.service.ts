import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Vehicle} from "./models";
import {filter} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) {

  }

  getVehicles() {
    return this.http.get<Vehicle[]>('/api/vehicles');
  }

  getVehiclesFrom(owner: number) {
    return this.http.get<Vehicle[]>(`/api/vehicles/?owner=${owner}`);
  }

  getVehicle(pk: number) {
    return this.http.get<Vehicle>('/api/vehicles/'+pk+'/');
  }

  create(vehicle: Vehicle) {
    return this.http.post('/api/vehicles/', vehicle);
  }

  update(vehicle:Vehicle, pk: number) {
    return this.http.put(`/api/vehicles/${pk}`+'/', vehicle);
  }

  delete(vehicle: Vehicle) {
    return this.http.delete(`/api/vehicles/${vehicle.pk}`);
  }
}
