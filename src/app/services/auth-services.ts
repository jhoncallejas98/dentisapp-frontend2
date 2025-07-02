import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {

  constructor(private http: HttpClient) { }

  loginUser (credentials: any) { // credencial es un objetio que se crea al hacer el login
     return this.http.post(' http://localhost:3000/api/auth/login', credentials);
  }
}
