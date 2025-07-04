import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServices } from '../services/auth-services';
import { catchError, map, of, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService =inject(AuthServices);
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
