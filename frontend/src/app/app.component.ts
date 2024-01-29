import { Component } from '@angular/core';
import {Route, Router} from "@angular/router";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  username = "";

  constructor(private router: Router, public userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.storeUser()
  }


  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }
}
