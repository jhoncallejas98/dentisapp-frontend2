import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppoimentsServices {

  constructor( private http: HttpClient) { }
  
  getAppoiments(){
    return this.http.get('http://localhost:3000/api/appoiment')
  }


  registerAppoiment(newAppoiment:any) {
    return this.http.post('http://localhost:3000/api/appoiment', newAppoiment)
  }
}
