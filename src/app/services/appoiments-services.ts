import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppoimentsServices {

  constructor( private http: HttpClient) { }
  
  getHeaders() {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders().set('x-token', token);
  }

  getAppoiments(){
    return this.http.get(`${environment.apiUrl}/appoiment`, { headers: this.getHeaders() });
  }

  getAppoimentById(id: string) {
    return this.http.get(`${environment.apiUrl}/appoiment/${id}`, { headers: this.getHeaders() });
  }

  registerAppoiment(newAppoiment:any) {
    return this.http.post(`${environment.apiUrl}/appoiment`, newAppoiment, { headers: this.getHeaders() });
  }

  updateAppoiment(id: string, updateData: any) {
    return this.http.patch(`${environment.apiUrl}/appoiment/${id}`, updateData, { headers: this.getHeaders() });
  }

  deleteAppoiment(id: string) {
    return this.http.delete(`${environment.apiUrl}/appoiment/${id}`, { headers: this.getHeaders() });
  }

  getAppoimentsByCedula(cedula: string) {
    return this.http.get(`${environment.apiUrl}/appoiment`, { headers: this.getHeaders() });
  }

  getAppoimentsByDoctor(doctorCedula: string) {
    return this.http.get(`${environment.apiUrl}/appoiment`, { headers: this.getHeaders() });
  }
}
