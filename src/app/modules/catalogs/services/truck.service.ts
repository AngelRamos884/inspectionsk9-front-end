import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TruckService {
    private controllerPath = 'truck'
    constructor(
        private httpClient:HttpClient
    ){
    }

    getTrucksByCustomerId(data:any){
        return this.httpClient.post(`${this.controllerPath}/getTrucksByCustomerId`, data);
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