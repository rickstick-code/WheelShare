import { Component } from '@angular/core';
import {User} from "../models";
import {UserService} from "../services/user.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-profiles-list',
  templateUrl: './profiles-list.component.html',
  styleUrls: ['./profiles-list.component.scss']
})
export class ProfilesListComponent {
  users: User[] = [];
  displayedColumns = ['pk', 'username', 'email', 'address', 'phone_number', 'edit', 'delete'];

  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.checkAndNavigate()
    this.userService.getUsers().subscribe(users => {
      this.users = users
    });
  }


  deleteUser(user: User) {

    var userResponse = confirm("Are you sure you want to delete this account?\n" +
      "This Change will not be reversible!");

    // Check the user's response
    if (userResponse) {
      this.userService.delete(user)
        .subscribe(() => this.ngOnInit());
    }
  }
}
