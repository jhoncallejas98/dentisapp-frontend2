import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
    return this.http.get(`http://localhost:3000/api/historiaClinica`, { headers: this.getHeaders() });
  }

  // Crear nueva historia clínica
  createHistoriaClinica(historia: any) {
    return this.http.post('http://localhost:3000/api/historiaClinica', historia, { headers: this.getHeaders() });
  }

  // Actualizar historia clínica
  updateHistoriaClinica(id: string, historia: any) {
    return this.http.patch(`http://localhost:3000/api/historiaClinica/${id}`, historia, { headers: this.getHeaders() });
  }

  // Obtener historia clínica por ID
  getHistoriaClinicaById(id: string) {
    return this.http.get(`http://localhost:3000/api/historiaClinica/${id}`, { headers: this.getHeaders() });
  }
}
