import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DentistServices {

  constructor( private http: HttpClient) { }
  
  getDentist(){
    return this.http.get(`${environment.apiUrl}/users/dentists`)
  }
}
