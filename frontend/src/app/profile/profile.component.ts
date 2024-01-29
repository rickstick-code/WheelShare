import { Component } from '@angular/core';
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userFormGroup: FormGroup;
  showUpdateMessage = false;
  randomImage = "1";

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.userFormGroup = new FormGroup({
      username: new FormControl(''),
      email: new FormControl(''),
      address: new FormControl(''),
      phone_number: new FormControl(''),
    });
  }

  ngOnInit(): void {
      this.userService.getUser(this.userService.getCurrentUserPk()!).subscribe(user => {
        this.userFormGroup.patchValue({
          ...user
        })
      });
      this.randomImage = Math.min(this.userService.getCurrentUserPk()!,9).toString();
  }

  changePassword(){
    alert("This is not part of our must haves now, but will be a future option!")
  }

  payingOptions(){
    alert("This is not part of our must haves now, but will be a future option!")
  }

  editPicture() {
    alert("This is not part of our must haves now, but will be a future option!")
  }

  deleteMyAccount(){
    var userResponse = confirm("Are you sure you want to delete your account?\n" +
      "This Change will not be reversible!");

    // Check the user's response
    if (userResponse) {
      // User clicked OK
      this.userService.delete(this.userService.currentUser)
      this.router.navigate(['/login']);
    }
  }

  getUsername(): string {
    return this.userFormGroup.get('username')?.value;
  }

  updateUser(){
      this.userService.update(this.userFormGroup.value, this.userService.getCurrentUserPk()!).subscribe(() => {
        this.showUpdateMessage = true; // Show the message
        setTimeout(() => this.showUpdateMessage = false, 2000);
        this.router.navigate(['/profile']);
      });
      this.userService.storeUser()
  }
}
