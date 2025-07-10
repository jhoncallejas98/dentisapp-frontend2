import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, AsideBar],
  templateUrl: './add-patient.html',
  styleUrls: ['./add-patient.css']
})
export class AddPatient {
  patient = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    genero: '',
    direccion: '',
    documento: '',
    tipoDocumento: '',
    ocupacion: '',
    estadoCivil: '',
    nombreContacto: '',
    telefonoContacto: '',
    parentescoContacto: '',
    alergias: '',
    medicamentos: '',
    antecedentes: ''
  };

  constructor(public router: Router) {}

  onSubmit() {
    // Aquí irá la lógica para guardar el paciente
    console.log('Paciente a guardar:', this.patient);
    // Por ahora solo redirigimos a la lista de pacientes
    this.router.navigate(['/admin/patients']);
  }

  showComingSoon() {
    alert('Funcionalidad próximamente disponible');
  }
} 