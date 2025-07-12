import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {

  constructor(private http: HttpClient) { }

  loginUser (credentials: any) { // credencial es un objetio que se crea al hacer el login
      return this.http.post(' http://localhost:3000/api/auth/login', credentials);
  }

  saveLocalStorage(key:string, value:any) {
    localStorage.setItem(key, value)
  }
// sirve  para eliminar cualquier llave del local storage. 
  deleteLocalStorage(key: string){
    localStorage.removeItem(key)
  }

    verifyAuthenticateUser() {
    return this.http.get('http://localhost:3000/api/auth/re-new-token', {headers: this.getHeaders()})
                .pipe( 
                  map((data: any) =>{
                  console.log('services',data);
                  return data.token;
                }),
                  catchError(()=>{
                    return of(false)
                  })
                );
  }
  
  // verificar el usuario autenticado 
  // ejemplo para explicar como funciona rxJs
  // verifyAuthenticateUser() {
  //   return this.http.get('http://localhost:3000/api/auth/re-new-token', {headers: this.getHeaders()})
  //               .pipe(
  //                 tap((data) => {
  //                   console.log(data) // {token: eydljklsjdkfjkld} en obejto 
  //                   return data; // lo retorna igual 
  //                 }), map( (newData: any)=> {
  //                   return newData.token;
  //                 }),
  //                 catchError(()=>{
  //                   return of(false)
  //                 })
  //               );
  // }

  getHeaders() {
    const token = localStorage.getItem('token') ?? ''; //obtiene el token del localstorage 
    return  new HttpHeaders().set('x-token', token) // envuelve el token en un header como en postma,tipo http... 
  }

  getAllUsers() {
    return this.http.get('http://localhost:3000/api/users', { headers: this.getHeaders() });
  }

  getCurrentUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || null;
    } catch {
      return null;
    }
  }

  getCurrentUserCedula(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.cedula || null;
    } catch {
      return null;
    }
  }

  getCurrentUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Métodos específicos para usuarios (solo lectura) - usando endpoints existentes
  getUserProfile() {
    const userId = this.getCurrentUserId();
    if (!userId) return null;
    return this.http.get(`http://localhost:3000/api/users/${userId}`, { headers: this.getHeaders() });
  }

  getUserAppointments() {
    const cedula = this.getCurrentUserCedula();
    if (!cedula) return null;
    
    console.log('Buscando citas para cédula:', cedula);
    
    // Obtener todas las citas y filtrar por cédula del paciente
    return this.http.get('http://localhost:3000/api/appoiment', { headers: this.getHeaders() })
      .pipe(
        map((data: any) => {
          console.log('Todas las citas obtenidas:', data);
          if (Array.isArray(data)) {
            const filteredAppointments = data.filter((appointment: any) => {
              console.log('Comparando cédula:', appointment.cedula, 'con:', cedula);
              return appointment.cedula === cedula || 
                     appointment.patientCedula === cedula || 
                     appointment.patient?.cedula === cedula ||
                     appointment.patient === cedula;
            });
            console.log('Citas filtradas para el usuario:', filteredAppointments);
            return filteredAppointments;
          }
          return [];
        })
      );
  }

  getUserFormulas() {
    const cedula = this.getCurrentUserCedula();
    if (!cedula) return null;
    // Obtener todas las fórmulas y filtrar por cédula del paciente
    return this.http.get('http://localhost:3000/api/formulacionMedica', { headers: this.getHeaders() })
      .pipe(
        map((data: any) => {
          if (Array.isArray(data)) {
            return data.filter((formula: any) => formula.patientCedula === cedula);
          }
          return [];
        })
      );
  }

  getUserIncapacities() {
    const cedula = this.getCurrentUserCedula();
    if (!cedula) return null;
    // Por ahora retornar array vacío ya que el endpoint no existe
    return of([]);
  }

  getUserClinicalHistory() {
    const cedula = this.getCurrentUserCedula();
    if (!cedula) return null;
    // Obtener todas las historias clínicas y filtrar por cédula del paciente
    return this.http.get('http://localhost:3000/api/historiaClinica', { headers: this.getHeaders() })
      .pipe(
        map((data: any) => {
          if (Array.isArray(data)) {
            return data.filter((history: any) => history.patientCedula === cedula);
          }
          return [];
        })
      );
  }
}
