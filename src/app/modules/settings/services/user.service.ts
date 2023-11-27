import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private controllerPath = 'user'
    constructor(
        private httpClient:HttpClient
    ){

    }

    getRolesActive():Observable<any>{
        return this.httpClient.get(`${this.controllerPath}/getRoles`);
    }

    save(data:any){
        const { id } = data;
        if(Number(id) > 0){
            return this.httpClient.put(`${this.controllerPath}/${id}`, data);
        }else{
            return this.httpClient.post(`${this.controllerPath}`, data);
        }
    }

    getAll():Observable<any>{
        return this.httpClient.get(this.controllerPath);
    }
}