import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class InspectionService {
    
    private controller = 'inspection'
    constructor(private http:HttpClient){

    }

    setInspection(data:any){
        return this.http.post(this.controller, data);
    }
}