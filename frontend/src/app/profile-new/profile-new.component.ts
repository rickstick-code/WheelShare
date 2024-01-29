import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-profile-new',
  templateUrl: './profile-new.component.html',
  styleUrls: ['./profile-new.component.scss']
})
export class ProfileNewComponent {
  pk: number | null = null;
  userFormGroup: FormGroup;

  constructor(private userService: UserService,
              private router: Router,) {
    this.userFormGroup = new FormGroup({
      username: new FormControl(''),
      password1: new FormControl(''),
      password2: new FormControl(''),
      email: new FormControl(''),
      address: new FormControl(''),
      phone_number: new FormControl(''),
    });
  }

  createUser(){
    this.userService.create(this.userFormGroup.value).subscribe(
      () => {
        this.router.navigate(['/profiles-list']);
      },
      (error) => {
        // Handle the error here
        alert(`Error: ${error.message}`);
      });
  }
}
