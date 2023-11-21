import { Inject } from '@angular/core';
import { Router } from '@angular/router';

// import Swal from 'sweetalert2';
import { AuthService } from '../modules/auth/services/auth.service';
import { take, tap } from 'rxjs';

export const AuthGuard = () => {

  const authService:AuthService = Inject(AuthService);
  const router = Inject(Router);

  return authService.isAuthenticated$()
    .pipe(
      take(1),
      tap((isLoggedIn: any) =>
        !!isLoggedIn ? router.navigate(['/login']) : true
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