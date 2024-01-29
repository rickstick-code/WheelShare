import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../models";
import {error} from "@angular/compiler-cli/src/transformers/util";


// A little workaround since it did no want to take the bool later on
interface UsernameExistsResponse {
  exists: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {

  readonly accessTokenLocalStorageKey = 'access_token';
  isLoggedIn$ = new BehaviorSubject(false);
  currentUser : User = {} as User

  constructor(private http: HttpClient, private router: Router, private jwtHelperService: JwtHelperService,
              private snackbar: MatSnackBar) {
    const token = localStorage.getItem(this.accessTokenLocalStorageKey);
    if (token) {
      console.log('Token expiration date: ' + this.jwtHelperService.getTokenExpirationDate(token));
      const tokenValid = !this.jwtHelperService.isTokenExpired(token);
      this.isLoggedIn$.next(tokenValid);
    }
  }

  // Not really relevant since all sites are created in a way that you can not change, create or see data
  // with the wrong permission anyway, but that way they can not see the page either
  checkAndNavigate() {
    if (!this.hasPermission('userapi.change_user')) {
      this.router.navigate(['/main-map']);
      alert("Du schlingel ;)")
    }
  }

  login(userData: { username: string, password: string }): void {
    this.http.post('/api/token/', userData)
      .subscribe({
        next: (res: any) => {
          this.isLoggedIn$.next(true);
          localStorage.setItem('access_token', res.access);
          this.storeUser()
          this.snackbar.open('Successfully logged in', 'OK', {duration: 3000});
          this.router.navigate(['/main-map']);
        },
        error: () => {
          this.snackbar.open('Invalid credentials', 'OK', {duration: 3000})
        }
      });
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenLocalStorageKey);
    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  // Only For Debugging
  printPermissions(): void {
    const token = localStorage.getItem(this.accessTokenLocalStorageKey);
    const decodedToken = this.jwtHelperService.decodeToken(token ? token : '');
    const permissions = decodedToken?.permissions;
    if (permissions) {
      console.log('Permissions:', JSON.stringify(permissions, null, 2));
    }
  }

  hasPermission(permission: string): boolean {
    const token = localStorage.getItem(this.accessTokenLocalStorageKey);
    const decodedToken = this.jwtHelperService.decodeToken(token ? token : '');
    const permissions = decodedToken?.permissions;
    return permissions ? permission in permissions : false;
  }

  getCurrentUserPk(): number | null {
    const token = localStorage.getItem(this.accessTokenLocalStorageKey);
    if (!token) {
      return null;
    }

    const decodedToken = this.jwtHelperService.decodeToken(token);
    return decodedToken ? decodedToken.user_id : null; // Assuming 'user_id' is the key in the payload containing the PK
  }

  storeUser() : void{
    this.getUser(this.getCurrentUserPk()!).subscribe(user => {
        this.currentUser = user; // Handle the received user data
    });
  }

  getUserDisplayName(pk: number): Observable<string> {
    return this.http.get<User>('/api/users/' + pk).pipe(
      map(user => user.username)
    );
  }

  delete(user: User) {
    return this.http.delete(`/api/users/${user.pk}`);
  }

  getUsers() {
    return this.http.get<User[]>('/api/users/');
  }

  getUser(pk?: number): Observable<User> {
      return this.http.get<User>('/api/users/' + pk);
  }

  create(user: User) {
    return this.http.post('/api/users/', user);
  }

  update(user:User, pk: number) {
    return this.http.put(`/api/users/${pk}`, user);
  }

  // Adjust the checkUsernameExists method
  checkUsernameExists(username: string): Observable<UsernameExistsResponse> {
    return this.http.get<UsernameExistsResponse>(`/api/users/check-username/?username=${username}`);
  }
}

