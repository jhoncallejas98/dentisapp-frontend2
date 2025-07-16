import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncapacidadServices {

  constructor(private http: HttpClient) { }

  getHeaders() {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders().set('x-token', token);
  }

  // Obtener todas las incapacidades
  getIncapacidades() {
    return this.http.get(`${environment.apiUrl}/incapacidades`, { headers: this.getHeaders() });
  }

  // Obtener incapacidades por cédula del paciente
  getIncapacidadesByCedula(cedula: string) {
    return this.http.get(`${environment.apiUrl}/incapacidades/cedula/${cedula}`, { headers: this.getHeaders() });
  }

  // Crear nueva incapacidad
  createIncapacidad(incapacidad: any) {
    return this.http.post(`${environment.apiUrl}/incapacidades`, incapacidad, { headers: this.getHeaders() });
  }

  // Actualizar incapacidad
  updateIncapacidad(id: string, incapacidad: any) {
    return this.http.patch(`${environment.apiUrl}/incapacidades/${id}`, incapacidad, { headers: this.getHeaders() });
  }

  // Eliminar incapacidad
  deleteIncapacidad(id: string) {
    return this.http.delete(`${environment.apiUrl}/incapacidades/${id}`, { headers: this.getHeaders() });
  }
} 