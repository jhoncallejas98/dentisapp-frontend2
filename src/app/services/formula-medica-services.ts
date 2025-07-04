import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormulaMedicaServices {

  private readonly baseUrl = 'http://localhost:3000/api/formulacionMedica';

  constructor(private http: HttpClient) {}

  // Registrar una nueva fórmula médica
  registerFormula(newFormula: any) {
    return this.http.post(this.baseUrl, newFormula);
  }

  // Obtener todas las fórmulas médicas
  getFormulas() {
    return this.http.get(this.baseUrl);
  }

  // Obtener una fórmula por ID
  getFormulaById(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Actualizar fórmula médica
  updateFormula(id: string, updatedData: any) {
    return this.http.put(`${this.baseUrl}/${id}`, updatedData);
  }

  // Eliminar fórmula médica
  deleteFormula(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}