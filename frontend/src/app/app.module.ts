import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {DateComponent} from "./date/date.component";
import { StarRatingModule } from 'angular-star-rating';
import {JwtModule} from "@auth0/angular-jwt";
import { LoginComponent } from './login/login.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { MainMapComponent } from './main-map/main-map.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfilesListComponent } from './profiles-list/profiles-list.component';
import { VehiclesListComponent } from './vehicles-list/vehicles-list.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileNewComponent } from './profile-new/profile-new.component';
import { VehicleNewComponent } from './vehicle-new/vehicle-new.component';
import { VehicleEditComponent } from './vehicle-edit/vehicle-edit.component';
import { VehiclesListPrivateComponent } from './vehicles-list-private/vehicles-list-private.component';
import { VehicleEditPrivateComponent } from './vehicle-edit-private/vehicle-edit-private.component';
import { VehicleNewPrivateComponent } from './vehicle-new-private/vehicle-new-private.component';
import { BookingsListComponent } from './bookings-list/bookings-list.component';
import { BookingComponent } from './booking/booking.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}
@NgModule({
  declarations: [
    AppComponent,
    DateComponent,
    LoginComponent,
    MainMapComponent,
    ProfileComponent,
    ProfilesListComponent,
    VehiclesListComponent,
    ProfileEditComponent,
    ProfileNewComponent,
    VehicleNewComponent,
    VehicleEditComponent,
    VehiclesListPrivateComponent,
    VehicleEditPrivateComponent,
    VehicleNewPrivateComponent,
    BookingsListComponent,
    BookingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSnackBarModule,
    StarRatingModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:8000']
      }
    }),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
