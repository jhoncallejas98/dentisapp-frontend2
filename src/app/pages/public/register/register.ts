import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      title: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
      cedula: ['', Validators.required],
      specialty: ['', Validators.required]
    });
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.registerForm.invalid) return;
    
    const formValue = this.registerForm.value;
    
    // Combinar título y nombre
    const fullName = `${formValue.title} ${formValue.name}`.trim();
    
    const userData = {
      name: fullName,
      email: formValue.email,
      password: formValue.password,
      cedula: formValue.cedula,
      role: 'dentist',
      dentistData: {
        specialty: formValue.specialty
      }
    };
    
    this.http.post('http://localhost:3000/api/users', userData).subscribe({
      next: (res: any) => {
        this.successMessage = 'Odontólogo registrado exitosamente.';
        this.registerForm.reset();
      },
      error: (err) => {
        this.errorMessage = err?.error?.msg || 'Error al registrar odontólogo.';
      }
    });
  }
}
