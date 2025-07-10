import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';

@Component({
  selector: 'app-availability-list',
  standalone: true,
  imports: [CommonModule, AsideBar],
  templateUrl: './availability-list.html',
  styleUrls: ['./availability-list.css']
})
export class AvailabilityList {
  availabilities = [
    {
      id: 1,
      diaSemana: 'Lunes',
      horaInicio: '08:00',
      horaFin: '17:00',
      bloquesDisponibles: ['08:00', '08:20', '08:40', '09:00', '09:20', '09:40', '10:00', '10:20', '10:40'],
      activo: true
    },
    {
      id: 2,
      diaSemana: 'Martes',
      horaInicio: '09:00',
      horaFin: '16:00',
      bloquesDisponibles: ['09:00', '09:20', '09:40', '10:00', '10:20', '10:40', '11:00', '11:20'],
      activo: true
    },
    {
      id: 3,
      diaSemana: 'Miércoles',
      horaInicio: '08:00',
      horaFin: '18:00',
      bloquesDisponibles: ['08:00', '08:20', '08:40', '09:00', '09:20', '09:40'],
      activo: false
    },
    {
      id: 4,
      diaSemana: 'Jueves',
      horaInicio: '10:00',
      horaFin: '15:00',
      bloquesDisponibles: ['10:00', '10:20', '10:40', '11:00', '11:20', '11:40'],
      activo: true
    }
  ];

  constructor(public router: Router) {}

  editAvailability(availabilityId: number) {
    this.router.navigate(['/admin/availability/edit', availabilityId]);
  }

  deleteAvailability(availabilityId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta disponibilidad?')) {
      // Aquí irá la lógica para eliminar disponibilidad
      console.log('Eliminar disponibilidad:', availabilityId);
      this.availabilities = this.availabilities.filter(a => a.id !== availabilityId);
    }
  }

  toggleAvailability(availabilityId: number) {
    const availability = this.availabilities.find(a => a.id === availabilityId);
    if (availability) {
      availability.activo = !availability.activo;
      // Aquí irá la lógica para actualizar el estado
      console.log('Cambiar estado de disponibilidad:', availabilityId, availability.activo);
    }
  }

  addNewAvailability() {
    this.router.navigate(['/disponibilidad']);
  }

  getStatusClass(activo: boolean): string {
    return activo ? 'activo' : 'inactivo';
  }

  getStatusText(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }

  showComingSoon() {
    alert('Funcionalidad próximamente disponible');
  }
} 