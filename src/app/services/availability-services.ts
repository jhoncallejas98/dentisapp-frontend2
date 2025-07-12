import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityServices {
  constructor(private http: HttpClient) { }

  getHeaders() {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders().set('x-token', token);
  }

  // Helper para normalizar el día de la semana
  private getDiaSemana(date: string): string {
    // Parsear la fecha manualmente para evitar problemas de zona horaria
    const [year, month, day] = date.split('-').map(Number);
    const fecha = new Date(year, month - 1, day); // month - 1 porque JavaScript cuenta desde 0
    
    console.log('Fecha original:', date);
    console.log('Fecha parseada:', fecha);
    console.log('getDay():', fecha.getDay());
    
    const diasSemana = {
      0: 'Domingo',
      1: 'Lunes', 
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado'
    };
    
    const diaSemana = diasSemana[fecha.getDay() as keyof typeof diasSemana];
    console.log('Día calculado:', diaSemana);
    
    return diaSemana;
  }

  getAvailability(dentistId: string, date: string) {
    const diaSemana = this.getDiaSemana(date);
    console.log('Frontend - Fecha:', date, 'Día de la semana:', diaSemana);
    return this.http.get(`http://localhost:3000/api/disponibilidad?dentist=${dentistId}&date=${date}&diaSemana=${diaSemana}`, { headers: this.getHeaders() });
  }

  createOrUpdateAvailability(data: any) {
    return this.http.post('http://localhost:3000/api/disponibilidad', data, { headers: this.getHeaders() });
  }

  getAllAvailabilities() {
    return this.http.get('http://localhost:3000/api/disponibilidad', { headers: this.getHeaders() });
  }
  updateAvailability(id: string, data: any) {
    return this.http.patch(`http://localhost:3000/api/disponibilidad`, data, { headers: this.getHeaders() });
  }
  deleteAvailability(id: string) {
    return this.http.delete(`http://localhost:3000/api/disponibilidad/${id}`, { headers: this.getHeaders() });
  }
} 