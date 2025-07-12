import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
    return this.http.get('http://localhost:3000/api/incapacidades', { headers: this.getHeaders() });
  }

  // Obtener incapacidades por cédula del paciente
  getIncapacidadesByCedula(cedula: string) {
    return this.http.get(`http://localhost:3000/api/incapacidades/cedula/${cedula}`, { headers: this.getHeaders() });
  }

  // Crear nueva incapacidad
  createIncapacidad(incapacidad: any) {
    return this.http.post('http://localhost:3000/api/incapacidades', incapacidad, { headers: this.getHeaders() });
  }

  // Actualizar incapacidad
  updateIncapacidad(id: string, incapacidad: any) {
    return this.http.patch(`http://localhost:3000/api/incapacidades/${id}`, incapacidad, { headers: this.getHeaders() });
  }

  // Eliminar incapacidad
  deleteIncapacidad(id: string) {
    return this.http.delete(`http://localhost:3000/api/incapacidades/${id}`, { headers: this.getHeaders() });
  }
} 