import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    private controllerPath = 'file'
    constructor(
        private httpClient: HttpClient
    ) {

    }

    uploadFile(data:any): Observable<any> {
        
        const formData = new FormData();

        const { file, customerId, driverId } = data;

        formData.set('file', file, file?.name);
        // formData.set('driverId', driverId);
        // formData.set('customerId', customerId);

        return this.httpClient.post(`${this.controllerPath}/upload?driverId=${driverId}&customerId=${customerId}`, formData);

    }
}