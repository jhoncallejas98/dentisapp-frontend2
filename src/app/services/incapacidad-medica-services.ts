import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
    return this.http.post('http://localhost:3000/api/incapacidadMedica', incapacidad, { headers: this.getHeaders() });
  }

  // Obtener todas las incapacidades médicas
  getAllIncapacidadesMedicas() {
    return this.http.get('http://localhost:3000/api/incapacidadMedica', { headers: this.getHeaders() });
  }

  // Obtener incapacidad médica por ID
  getIncapacidadMedicaById(id: string) {
    return this.http.get(`http://localhost:3000/api/incapacidadMedica/${id}`, { headers: this.getHeaders() });
  }

  // Actualizar incapacidad médica por ID
  updateIncapacidadMedicaById(id: string, incapacidad: any) {
    return this.http.patch(`http://localhost:3000/api/incapacidadMedica/${id}`, incapacidad, { headers: this.getHeaders() });
  }

  // Eliminar incapacidad médica por ID
  removeIncapacidadMedicaById(id: string) {
    return this.http.delete(`http://localhost:3000/api/incapacidadMedica/${id}`, { headers: this.getHeaders() });
  }

  // Ruta de prueba
  testIncapacidadMedica() {
    return this.http.get('http://localhost:3000/api/incapacidadMedica/test', { headers: this.getHeaders() });
  }
} 