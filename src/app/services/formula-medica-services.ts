import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class FormulaMedicaServices {
  private readonly baseUrl = `${environment.apiUrl}/formulacionMedica`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { headers: new HttpHeaders({ 'X-Token': token }) } : {};
  }

  // Registrar una nueva fórmula médica
  registerFormula(newFormula: any) {
    return this.http.post(this.baseUrl, newFormula, this.getAuthHeaders());
  }

  // Obtener todas las fórmulas médicas
  getFormulas() {
    return this.http.get(this.baseUrl, this.getAuthHeaders());
  }

  // Obtener una fórmula por ID
  getFormulaById(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }

  // Actualizar fórmula médica
  updateFormula(id: string, updatedData: any) {
    return this.http.put(`${this.baseUrl}/${id}`, updatedData, this.getAuthHeaders());
  }

  // Eliminar fórmula médica
  deleteFormula(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }
}