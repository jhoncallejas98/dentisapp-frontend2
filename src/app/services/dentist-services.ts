import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DentistServices {

  constructor( private http: HttpClient) { }
  
  getDentist(){
    return this.http.get('http://localhost:3000/api/users/dentists')
  }
}
