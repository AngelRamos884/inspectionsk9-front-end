import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// import Swal from 'sweetalert2';
import { AuthService } from '../modules/auth/services/auth.service';
import { take, tap } from 'rxjs';

export const LoginGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated$()
    .pipe(
      take(1),
      tap((isLoggedIn: any) => {
        if(isLoggedIn){
          router.navigate(['/dashboards/dashboard1'])
          return true;
        }else{
          // router.navigate(['/authentication/login']);
          return false;
        }
        // !!isLoggedIn ? router.navigate(['/dashboards/dashboard1']) : true

      }
      )
    )

}

export const AuthGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated$()
    .pipe(
      take(1),
      tap((isLoggedIn: any) => {
        if (isLoggedIn) {
          return false;
        } else {
          router.navigate(['/authentication/login']);
          return true;
        }
      }
      )
    )

}

// @Injectable({providedIn: 'root'})
// export class AuthGuard implements CanActivate {
//     constructor(private _authService:AuthService,
//                 private router:Router) { }

//     canActivate():boolean{
//         var token = localStorage.getItem('token');
//         if(!token){
//           this.router.navigateByUrl('/auth');
//           return false;
//         }
//         if(this._authService.isAuth()){
//           return true;
//         }
//         else{
//           Swal.fire({
//             icon:'error',
//             title:'Token',
//             text: "Your token has expired"
//           }).then((r)=>{
//             this.router.navigateByUrl('/auth');
//             return false;
//           });
//           return false;
//         }
//     }

//     canLoad(route: Route,
//             segments: import("@angular/router").UrlSegment[]): boolean |
//                       import("@angular/router").UrlTree |
//                       import("rxjs").Observable<boolean |
//                       import("@angular/router").UrlTree> | Promise<boolean |
//                       import("@angular/router").UrlTree> {
//               if(this._authService.isAuth()){
//                 return true;
//               }
//               else{
//                 Swal.fire({
//                   icon:'error',
//                   title:'Token',
//                   text: "Your token has expired"
//                 }).then((r)=>{
//                   this.router.navigateByUrl('/auth');
//                   return false;
//                 });
//                 return false;
//               }
//     }
// }