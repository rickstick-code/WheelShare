import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Map, MapStyle, Marker, config, Popup } from '@maptiler/sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Type, Vehicle } from '../models';
import { TypeService } from '../type.service';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.scss']
})
export class MainMapComponent implements OnInit, AfterViewInit, OnDestroy {
  map!: Map;
  vehicles!: Observable<Vehicle[]>;
  types: Type[] = [];

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(
    public typeService: TypeService,
    public vehicleService: VehicleService,
    private router: Router
  ) {
    document.addEventListener('click', this.handleGlobalClick.bind(this));
  }

  ngOnInit(): void {
    config.apiKey = '4oaTVIMMIiHxU5NOe0mb';

    this.vehicles = this.vehicleService.getVehicles().pipe(
      map(vehicles => vehicles.map(vehicle => ({
        ...vehicle,
      })))
    );
  }

  ngAfterViewInit(): void {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    .vehicle-info h3 {
      text-align: center;
    }
    .button-container {
      display: flex;
      justify-content: center;
    }

    .profile-button {
      background-color: #58d58e;
      border-radius: 2vw;
      font-size: 0.8vw;
      font-weight: bold;
      margin: 1vw;
      padding: 1vw 2vw;
      border: none;
      cursor: pointer;
    }
    .profile-button:hover {
      background-color: #4ec27f;
    }
  `;

    document.head.appendChild(style);
    this.requestLocation();
  }

  private requestLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.initializeMap(position.coords.longitude, position.coords.latitude);
        },
        () => {
          this.useDefaultLocation();
        }
      );
    } else {
      this.useDefaultLocation();
    }
  }

  private useDefaultLocation(): void {
    const defaultLongitude = 15.421371;
    const defaultLatitude = 47.076668;
    this.initializeMap(defaultLongitude, defaultLatitude);
  }

  private initializeMap(longitude: number, latitude: number): void {
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.WINTER,
      center: [longitude, latitude],
      zoom: 14
    });

    this.addMarkers();
  }

  private addMarkers(): void {
    this.vehicles.subscribe(vehicles => {
      vehicles.forEach(vehicle => {
        const popupContent = `
          <div class="container">
              <div class="vehicle-info">
                  <h3>${vehicle.model}</h3>
                  <ul>
                      <li>Type:  ${vehicle.type.map(t => t.name).join(', ')}</li>
                      <li>Seats:  ${vehicle.number_of_seats}</li>
                      <li>Vignette:  ${vehicle.vignette}</li>
                      <li>Comment:  ${vehicle.comment}</li>
                  </ul>
              </div>
              <div class="button-container">
                <button data-pk="${vehicle.pk}" class="profile-button">Book Vehicle</button>
            </div>
          </div>
        `;
        new Marker({ color: "#32c873" })
          .setLngLat([vehicle.lon, vehicle.lan])
          .setPopup(new Popup().setHTML(popupContent))
          .addTo(this.map);
      });
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
    document.removeEventListener('click', this.handleGlobalClick.bind(this));
  }

  private handleGlobalClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON' && target.dataset['pk']) {
      const pk = target.dataset['pk'];
      this.router.navigateByUrl(`/booking/${pk}`);
    }
  }
}
