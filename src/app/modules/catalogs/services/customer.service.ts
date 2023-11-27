import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomersService {
    private controllerPath = 'customer'
    constructor(
        private httpClient:HttpClient
    ){

    }

    getCustomersActive():Observable<any>{
        return this.httpClient.get(`${this.controllerPath}/getCustomersActive`);
    }

    saveCustomer(data:any){
        const { id } = data;
        if(Number(id) > 0){
            return this.httpClient.put(`${this.controllerPath}/${id}`, data);
        }else{
            return this.httpClient.post(this.controllerPath, data);
        }
    }

    getAllCustomers():Observable<any>{
        return this.httpClient.get(this.controllerPath);
    }
}