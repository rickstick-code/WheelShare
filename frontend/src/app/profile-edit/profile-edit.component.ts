import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent {
  pk: number | null = null;
  userFormGroup: FormGroup;
  randomImage = "1";

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,) {
              this.userFormGroup = new FormGroup({
                pk: new FormControl(''),
                username: new FormControl(''),
                email: new FormControl(''),
                address: new FormControl(''),
                phone_number: new FormControl(''),
              });
  }

  ngOnInit(): void {
    this.pk = Number(this.route.snapshot.paramMap.get('pk'));
    if(this.pk){
      this.userService.getUser(this.pk).subscribe(user => {
        this.userFormGroup.patchValue({
          ...user
        })
      });
    }else{
      alert("Warning no ID Found!");
    }
    this.randomImage = Math.min(this.pk).toString();
  }

  getUsername(): string {
    return this.userFormGroup.get('username')?.value;
  }

  updateUser(){
    if (this.pk) {
      this.userService.update(this.userFormGroup.value, this.pk).subscribe(() => {
        this.router.navigate(['/profiles-list']);
      })
    }else{
      alert("Warning no ID Found!");
    }
  }
}
