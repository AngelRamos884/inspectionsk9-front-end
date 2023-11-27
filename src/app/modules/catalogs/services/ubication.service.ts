import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UbicationService {

    private controllerPath = 'location'
    constructor(
        private httpClient:HttpClient
    ){

    }

    getLocationsActive():Observable<any>{
        return this.httpClient.get(`${this.controllerPath}/getLocationsActive`);
    }

    saveUbication(data:any){
        const { id } = data;
        if(Number(id) > 0){
            return this.httpClient.put(`${this.controllerPath}/${id}`, data);
        }else{
            return this.httpClient.post(this.controllerPath, data);
        }
    }

    getAllUbications(){
        return this.httpClient.get(this.controllerPath);
    }
}