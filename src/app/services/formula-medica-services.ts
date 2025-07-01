import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormulaMedicaServices {

  constructor( private http: HttpClient) { }

  registerFormula(newFormula:any) {
    return this.http.post('http://localhost:3000/api/formulacionMedica', newFormula)
  }
}
