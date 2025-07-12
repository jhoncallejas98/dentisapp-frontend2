import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
    return this.http.get('http://localhost:3000/api/appoiment', { headers: this.getHeaders() });
  }

  getAppoimentById(id: string) {
    return this.http.get(`http://localhost:3000/api/appoiment/${id}`, { headers: this.getHeaders() });
  }

  registerAppoiment(newAppoiment:any) {
    return this.http.post('http://localhost:3000/api/appoiment', newAppoiment, { headers: this.getHeaders() });
  }

  updateAppoiment(id: string, updateData: any) {
    return this.http.patch(`http://localhost:3000/api/appoiment/${id}`, updateData, { headers: this.getHeaders() });
  }

  deleteAppoiment(id: string) {
    return this.http.delete(`http://localhost:3000/api/appoiment/${id}`, { headers: this.getHeaders() });
  }

  getAppoimentsByCedula(cedula: string) {
    return this.http.get(`http://localhost:3000/api/appoiment/paciente/${cedula}`, { headers: this.getHeaders() });
  }
}
