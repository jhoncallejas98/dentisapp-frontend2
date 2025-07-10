import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Patient {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipoDocumento: string;
  documento: string;
  fechaNacimiento: Date;
  ultimaVisita: Date;
  estado: string;
}

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './patients-list.html',
  styleUrl: './patients-list.css'
})
export class PatientsListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    // Datos de ejemplo - en una aplicación real esto vendría de un servicio
    this.patients = [
      {
        id: 1,
        nombre: 'María',
        apellido: 'González',
        email: 'maria.gonzalez@email.com',
        telefono: '+57 300 123 4567',
        tipoDocumento: 'CC',
        documento: '1022465873',
        fechaNacimiento: new Date('1990-05-15'),
        ultimaVisita: new Date('2024-01-15'),
        estado: 'Activo'
      },
      {
        id: 2,
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        email: 'carlos.rodriguez@email.com',
        telefono: '+57 310 987 6543',
        tipoDocumento: 'CC',
        documento: '98362792',
        fechaNacimiento: new Date('1985-08-22'),
        ultimaVisita: new Date('2024-01-10'),
        estado: 'Activo'
      },
      {
        id: 3,
        nombre: 'Ana',
        apellido: 'Pérez',
        email: 'ana.perez@email.com',
        telefono: '+57 315 555 1234',
        tipoDocumento: 'CE',
        documento: '29376252',
        fechaNacimiento: new Date('1992-12-03'),
        ultimaVisita: new Date('2023-12-20'),
        estado: 'Inactivo'
      },
      {
        id: 4,
        nombre: 'Laura',
        apellido: 'Garzón',
        email: 'laura.garzon@email.com',
        telefono: '+57 300 123 4567',
        tipoDocumento: 'CC',
        documento: '1022465873',
        fechaNacimiento: new Date('1988-03-10'),
        ultimaVisita: new Date('2024-01-20'),
        estado: 'Nuevo'
      }
    ];
    this.filteredPatients = [...this.patients];
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredPatients = [...this.patients];
      return;
    }

    const search = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(patient =>
      patient.nombre.toLowerCase().includes(search) ||
      patient.apellido.toLowerCase().includes(search) ||
      patient.email.toLowerCase().includes(search) ||
      patient.documento.includes(search)
    );
  }

  getAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  getActivePatients(): number {
    return this.patients.filter(p => p.estado === 'Activo').length;
  }

  getNewPatientsThisMonth(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return this.patients.filter(p => {
      const visitDate = new Date(p.ultimaVisita);
      return visitDate.getMonth() === currentMonth && 
             visitDate.getFullYear() === currentYear &&
             p.estado === 'Nuevo';
    }).length;
  }

  getAppointmentsThisWeek(): number {
    // Simulación - en una aplicación real esto vendría de un servicio
    return 12;
  }

  viewPatient(id: number) {
    console.log('Ver paciente:', id);
    // Aquí iría la navegación a la vista detallada del paciente
  }

  editPatient(id: number) {
    console.log('Editar paciente:', id);
    // Aquí iría la navegación al formulario de edición
  }

  deletePatient(id: number) {
    console.log('Eliminar paciente:', id);
    // Aquí iría la lógica para eliminar el paciente
    if (confirm('¿Estás seguro de que quieres eliminar este paciente?')) {
      this.patients = this.patients.filter(p => p.id !== id);
      this.onSearch(); // Actualizar la lista filtrada
    }
  }
} 