import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {authGuard} from "./auth.guard";
import {MainMapComponent} from "./main-map/main-map.component";
import {ProfileComponent} from "./profile/profile.component";
import {ProfilesListComponent} from "./profiles-list/profiles-list.component";
import {VehiclesListComponent} from "./vehicles-list/vehicles-list.component";
import {ProfileEditComponent} from "./profile-edit/profile-edit.component";
import {ProfileNewComponent} from "./profile-new/profile-new.component";
import {VehicleNewComponent} from "./vehicle-new/vehicle-new.component";
import {VehicleEditComponent} from "./vehicle-edit/vehicle-edit.component";
import {VehiclesListPrivateComponent} from "./vehicles-list-private/vehicles-list-private.component";
import {VehicleEditPrivateComponent} from "./vehicle-edit-private/vehicle-edit-private.component";
import {VehicleNewPrivateComponent} from "./vehicle-new-private/vehicle-new-private.component";
import {BookingsListComponent} from "./bookings-list/bookings-list.component";
import {BookingsService} from "./bookings.service";
import {BookingComponent} from "./booking/booking.component";

const routes: Routes = [
  {path: '', redirectTo: '/main-map', pathMatch: 'full'},
  { path: 'profiles-list', component: ProfilesListComponent, canActivate: [authGuard] },
  { path: 'profile-new', component: ProfileNewComponent, canActivate: [authGuard] },
  { path: 'profile-edit/:pk', component: ProfileEditComponent, canActivate: [authGuard] },
  { path: 'vehicles-list', component: VehiclesListComponent, canActivate: [authGuard] },
  { path: 'vehicles-list-private', component: VehiclesListPrivateComponent, canActivate: [authGuard] },
  { path: 'vehicle-new', component: VehicleNewComponent, canActivate: [authGuard] },
  { path: 'vehicle-new-private', component: VehicleNewPrivateComponent, canActivate: [authGuard] },
  { path: 'vehicle-edit/:pk', component: VehicleEditComponent, canActivate: [authGuard] },
  { path: 'vehicle-edit-private/:pk', component: VehicleEditPrivateComponent, canActivate: [authGuard] },
  { path: 'booking/:pk', component: BookingComponent, canActivate: [authGuard] },
  { path: 'bookings-list', component: BookingsListComponent, canActivate: [authGuard] },
  { path: 'main-map', component: MainMapComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
