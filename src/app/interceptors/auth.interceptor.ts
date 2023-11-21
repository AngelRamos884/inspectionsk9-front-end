import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// import { environment } from '../../';
import {tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
// import { SpinnerService } from '@shared/spinner/spinner.service';

@Injectable({ providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor {

    private environment: any;
    constructor(){
        // private _spinnerService:SpinnerService
        this.environment = 'http://localhost:8000/api/'
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // this._spinnerService.requestStarted();
        const token = localStorage.getItem('token');
        let reqClone;
        if( req.url.match(/Auth/gi)){
            reqClone = req.clone({
                url:`${this.environment}${req.url}`
            });
        }
        if (!token) {
            reqClone = req.clone({
                setHeaders:{Authorization:`Bearer ${token}`},
                url:`${this.environment}${req.url}`
            });
        }        
        if(req.body instanceof FormData) {
            reqClone = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                    observe: 'events'
                },
                url: `${this.environment}${req.url}`
            });
        }else{
            reqClone = req.clone({
                setHeaders: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                url: `${this.environment}${req.url}`
            });
        }

        return this.handler(next, reqClone);
    }

    handler(next:any, request:any){
        return next.handle(request)
            .pipe(
                tap(
                    (event) => {
                        if(event instanceof HttpResponse){
                            // this._spinnerService.requestEnded();
                        }
                    },
                    (error: HttpErrorResponse) => {
                        // this._spinnerService.resetSpinner();
                        this.handleError(error);
                    }
                )
            )
    }

    handleError( error:any ){
        Swal.close();
        switch (error.status) {
            case 400: {
                Swal.fire({
                    title:"Not found",
                    text:error.error,
                    icon:"warning"
                  });   
                  return throwError(error);
            }
            case 401: {
                Swal.fire({
                    title:"Unauthorized",
                    text:"You don't have access",
                    icon:"error"
                  }); 
                  return throwError(error);
            }
            case 404: {
                Swal.fire({
                    title:"Validation",
                    text:error.error,
                    icon:"error",
                    confirmButtonColor: '#e05757'
                  });   
                  return throwError(error);
            }
            case 0: {
                Swal.fire({
                    title:"Unauthorized",
                    text:"You don't have access",
                    icon:"error",
                    confirmButtonColor: '#e05757'
                  });   
                  return throwError(error);
            }
            case 403: {
                Swal.fire({
                    title:"Access Denied",
                    text:'error: ' + error.message,
                    icon:"error"
                  }); 
                  return throwError(error);
            }
            case 500: {
                Swal.fire({
                    title:"Internal Server Error",
                    text: error.error,
                    icon:"error"
                  }); 
                  return throwError(error);
            }
            default: {
                Swal.fire({
                    title:"Unknown Server Errorr",
                    text: 'Unknown Server Error: ' + error.message,
                    icon:"error"
                  }); 
                  return throwError(error);
            }

        }       
    }

    getSite(){
        
    }
}