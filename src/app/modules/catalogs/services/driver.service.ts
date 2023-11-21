import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DriverService {
    private controllerPath = 'driver'
    constructor(
        private httpClient:HttpClient
    ){

    }
    save(data:any){
        const { id } = data;
        if(Number(id) > 0){
            return this.httpClient.put(`${this.controllerPath}/${id}`, data);
        }else{
            return this.httpClient.post(this.controllerPath, data);
        }
    }

    getAll(){
        return this.httpClient.get(this.controllerPath);
    }
}