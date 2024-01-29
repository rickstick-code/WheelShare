import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../services/user.service";
import {User} from "../models";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;
  usernameChecked = false;
  usernameExists = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,
              private snackbar: MatSnackBar,
              private userService: UserService) {
    this.loginFormGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  login(): void {
    this.userService.login(this.loginFormGroup.value);
  }


  register(){
    this.userService.create(this.loginFormGroup.value).subscribe(
      () => {
        this.userService.login(this.loginFormGroup.value);
      },
      (error) => {
        // Handle the error here
        console.error(`Error: ${error.message}`);
        alert("There was something wrong with you trying to register.\n Make sure, your username is not taken yet.")
      });
  }

  checkUsername(): void {
    const username = this.loginFormGroup.get('username')?.value;
    if (username) {
      this.userService.checkUsernameExists(username).subscribe(response => {
        this.usernameExists = response.exists; // TypeScript knows response has an 'exists' property
        this.usernameChecked = true;
      }, error => {
        console.error('Error checking username:', error);
        // Optionally handle error
      });
    }
  }


}
