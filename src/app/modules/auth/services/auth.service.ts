import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { environment } from '../../../../environments/environment';
// import { ILogin } from '../interfaces/ILogin';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, delay, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly isLoggedIn = new BehaviorSubject<boolean>(false);
  private controller: string = 'auth/'
  private token: any = "";
  private timeExp: string = "";
  constructor(private _httpClient: HttpClient, private router: Router) {
    this.readToken();
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('ubicationSelected');
    this.router.navigate(['/authentication/login'])
  }

  isAuthenticated$(): Observable<boolean> {
    if(!this.token){
      return this.isLoggedIn;
    }

    if (this.token.length < 2) {
      // this.isLoggedIn.next(false);
      return this.isLoggedIn;
    }
    const expired = Number(localStorage.getItem('expired'));
    const expiredDate = new Date(expired * 1000);
    const curentlyDate = new Date();
    if (expiredDate > curentlyDate) {
      this.isLoggedIn.next(true);
      return this.isLoggedIn;
    }
    else {
      return this.isLoggedIn;
    }

  }

  singUp<T>(login: any): Observable<any> {
    return this._httpClient
      .post(this.controller + 'register', login)
  }

  login<T>(login: any): Observable<any> {
    return this._httpClient
      .post(this.controller + 'login', login)
      .pipe(
        map((resp: any) => {
          debugger
          const { token, exp, email, displayName, ...data } = resp?.user;
          this.timeExp = String(exp);
          // console.log(resp)
          // localStorage.setItem('token', token);
          localStorage.setItem('displayName', displayName);
          localStorage.setItem('email', email);
          // localStorage.setItem('roles', roles);
          // localStorage.setItem('casetas',  JSON.stringify(resp?.casetas))
          this.router.navigate(['/dashboards/dashboard1']);
          this.saveToken(token);
          return;
        }),
        catchError(err => {
          Swal.fire({
            icon: 'error',
            title: 'ALTO!',
            text: err.error
          });
          throw err;
        })
      )
  }

  setNewPassword<T>(newPassword: any, token: string): Observable<any> {
    return this._httpClient
      .post(this.controller + 'users/change-password', newPassword)
      .pipe(
        map((resp: any) => {
          Swal.close();
          return resp;
        }),
        catchError(err => {
          Swal.fire({
            icon: 'error',
            title: 'Stop',
            text: err.error.msg
          });
          throw err;
        })
      )
  }

  recoveryPassword(email: any) {
    return this._httpClient
      .post(this.controller + 'users/forgot-password', { email })
      .pipe(
        map((resp: any) => {
          Swal.close();
          return resp;
        }),
        catchError(err => {
          Swal.fire({
            icon: 'error',
            title: 'Stop',
            text: err.error.msg
          });
          throw err;
        })
      )
  }

  setItemToLocalStorage(value: any, name: any): any {
    localStorage.setItem(name, value);
    return value;
  }

  /* This method is for save token and set expired date to validate that the life of token will be valid */
  private saveToken(token: string) {
    this.token = token;
    var newDateObj = new Date();
    newDateObj.setTime(Number(this.timeExp));
    localStorage.setItem('expired', newDateObj.getTime().toString());
    localStorage.setItem('token', token);
  }

  /* Method for read token from localstorage and set into prop */
  readToken() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token')?.toString();
    } else {
      this.token = '';
    }
    return this.token;
  }
  /* Check if date is not expired */
  isAuth(): boolean {
    if (this.token.length < 2) {
      return false;
    }
    const expired = Number(localStorage.getItem('expired'));
    const expiredDate = new Date(expired * 1000);
    const curentlyDate = new Date();
    if (expiredDate > curentlyDate) {
      return true;
    }
    else {
      return false;
    }

  }
}