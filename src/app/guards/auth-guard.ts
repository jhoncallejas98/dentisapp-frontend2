import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServices } from '../services/auth-services';
import { catchError, map, of, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServices);
  const router = inject(Router)
   return authService.verifyAuthenticateUser()
    .pipe(
      map((data) =>{
        console.log('Guard',data);
    if (!data){
      router.navigateByUrl('home')
      return false
    }

        return true
      }),
      catchError(()=>{
        return of(false);
      }) 
    );
};

// Guard para verificar si el usuario es doctor/admin
export const dentistGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServices);
  const router = inject(Router);
  
  const userRole = authService.getCurrentUserRole();
  
  if (userRole === 'dentist' || userRole === 'admin') {
    return true;
  } else {
    // Si no es doctor, redirigir al dashboard de usuarios
    router.navigateByUrl('dashboard-users');
    return false;
  }
};

// Guard para verificar si el usuario es paciente
export const patientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServices);
  const router = inject(Router);
  
  const userRole = authService.getCurrentUserRole();
  
  if (userRole === 'patient') {
    return true;
  } else {
    // Si no es paciente, redirigir al dashboard principal
    router.navigateByUrl('dashboard');
    return false;
  }
};
