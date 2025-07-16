import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaServices {

  constructor(private http: HttpClient) { }

  getHeaders() {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders().set('x-token', token);
  }

  // Buscar historia clínica por cédula (obtener todas y filtrar)
  getHistoriaClinicaByCedula(cedula: string) {
    return this.http.get(`${environment.apiUrl}/historiaClinica`, { headers: this.getHeaders() });
  }

  // Crear nueva historia clínica
  createHistoriaClinica(historia: any) {
    return this.http.post(`${environment.apiUrl}/historiaClinica`, historia, { headers: this.getHeaders() });
  }

  // Actualizar historia clínica
  updateHistoriaClinica(id: string, historia: any) {
    return this.http.patch(`${environment.apiUrl}/historiaClinica/${id}`, historia, { headers: this.getHeaders() });
  }

  // Obtener historia clínica por ID
  getHistoriaClinicaById(id: string) {
    return this.http.get(`${environment.apiUrl}/historiaClinica/${id}`, { headers: this.getHeaders() });
  }
}
