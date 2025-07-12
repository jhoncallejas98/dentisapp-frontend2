import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServices } from '../../../services/auth-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  formData!: FormGroup;

  constructor(private authServices: AuthServices, private router: Router) {
    this.formData = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(6), Validators.maxLength(12)] )
    })
  }

  onSubmit(){
    if (this.formData.valid){
      console.log(this.formData.value);

    this.authServices.loginUser(this.formData.value).subscribe({
      next: (data: any) => {
        this.authServices.saveLocalStorage('token',data.token) // almacena el token en el local storage
        if (data.user && data.user._id) {
          this.authServices.saveLocalStorage('userId', data.user._id);
          // Guardar también los datos completos del usuario
          this.authServices.saveLocalStorage('user', JSON.stringify(data.user));
        }
        
        // Redirigir según el rol del usuario
        const userRole = data.user?.role;
        if (userRole === 'dentist' || userRole === 'admin') {
          // Doctor/Admin va al dashboard principal
          this.router.navigateByUrl('dashboard');
        } else if (userRole === 'patient') {
          // Paciente va al dashboard de usuarios
          this.router.navigateByUrl('dashboard-users');
        } else {
          // Por defecto va al dashboard principal
          this.router.navigateByUrl('dashboard');
        }
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.formData.reset();
      }
    });
    }
  }
}
