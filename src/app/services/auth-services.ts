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
    return  new HttpHeaders().set('X-Token', token) // envuelve el token en un header como en postma,tipo http... 
  }
}
