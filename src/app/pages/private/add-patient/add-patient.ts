import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-patient.html',
  styleUrl: './add-patient.css'
})
export class AddPatient {
  userForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  submitting: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
      cedula: ['', Validators.required],
      role: ['patient', Validators.required],
      specialty: ['']
    });

    // Validación dinámica de especialidad
    this.userForm.get('role')?.valueChanges.subscribe(role => {
      const specialtyControl = this.userForm.get('specialty');
      if (role === 'dentist') {
        specialtyControl?.setValidators([Validators.required]);
      } else {
        specialtyControl?.clearValidators();
      }
      specialtyControl?.updateValueAndValidity();
    });
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.userForm.invalid) return;
    
    this.submitting = true;
    const formValue = this.userForm.value;
    let userData: any = {
      name: formValue.name,
      email: formValue.email,
      password: formValue.password,
      cedula: formValue.cedula,
      role: formValue.role
    };
    if (formValue.role === 'dentist') {
      userData.dentistData = { specialty: formValue.specialty };
    }
    this.http.post(`${environment.apiUrl}/users`, userData).subscribe({
      next: (res: any) => {
        this.successMessage = 'Usuario registrado exitosamente.';
        this.userForm.reset({ role: 'patient' });
        this.submitting = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.msg || 'Error al registrar usuario.';
        this.submitting = false;
      }
    });
  }
} 