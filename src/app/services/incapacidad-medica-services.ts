import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncapacidadMedicaServices {

  constructor(private http: HttpClient) { }
  
  getHeaders() {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders().set('x-token', token);
  }

  // Crear nueva incapacidad médica
  createIncapacidadMedica(incapacidad: any) {
    return this.http.post(`${environment.apiUrl}/incapacidadMedica`, incapacidad, { headers: this.getHeaders() });
  }

  // Obtener todas las incapacidades médicas
  getAllIncapacidadesMedicas() {
    return this.http.get(`${environment.apiUrl}/incapacidadMedica`, { headers: this.getHeaders() });
  }

  // Obtener incapacidad médica por ID
  getIncapacidadMedicaById(id: string) {
    return this.http.get(`${environment.apiUrl}/incapacidadMedica/${id}`, { headers: this.getHeaders() });
  }

  // Actualizar incapacidad médica por ID
  updateIncapacidadMedicaById(id: string, incapacidad: any) {
    return this.http.patch(`${environment.apiUrl}/incapacidadMedica/${id}`, incapacidad, { headers: this.getHeaders() });
  }

  // Eliminar incapacidad médica por ID
  removeIncapacidadMedicaById(id: string) {
    return this.http.delete(`${environment.apiUrl}/incapacidadMedica/${id}`, { headers: this.getHeaders() });
  }

  // Ruta de prueba
  testIncapacidadMedica() {
    return this.http.get(`${environment.apiUrl}/incapacidadMedica/test`, { headers: this.getHeaders() });
  }
} 