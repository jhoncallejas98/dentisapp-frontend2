import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';

@Component({
  selector: 'app-edit-availability',
  standalone: true,
  imports: [CommonModule, FormsModule, AsideBar],
  templateUrl: './edit-availability.html',
  styleUrls: ['./edit-availability.css']
})
export class EditAvailability implements OnInit {
  availability = {
    id: 0,
    diaSemana: '',
    horaInicio: '',
    horaFin: '',
    bloquesDisponibles: [] as string[],
    activo: true
  };

  allTimeSlots = [
    '08:00', '08:20', '08:40', '09:00', '09:20', '09:40',
    '10:00', '10:20', '10:40', '11:00', '11:20', '11:40',
    '12:00', '12:20', '12:40', '13:00', '13:20', '13:40',
    '14:00', '14:20', '14:40', '15:00', '15:20', '15:40',
    '16:00', '16:20', '16:40', '17:00', '17:20', '17:40'
  ];

  constructor(
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Simular carga de datos de disponibilidad existente
    const availabilityId = this.route.snapshot.params['id'];
    this.loadAvailability(availabilityId);
  }

  loadAvailability(id: string) {
    // Aquí irá la lógica para cargar la disponibilidad desde el backend
    // Por ahora simulamos datos
    this.availability = {
      id: parseInt(id),
      diaSemana: 'Lunes',
      horaInicio: '08:00',
      horaFin: '17:00',
      bloquesDisponibles: ['08:00', '08:20', '08:40', '09:00', '09:20', '09:40'],
      activo: true
    };
  }

  onTimeRangeChange() {
    // Actualizar bloques disponibles basado en el rango de tiempo
    this.updateAvailableSlots();
  }

  updateAvailableSlots() {
    if (!this.availability.horaInicio || !this.availability.horaFin) {
      return;
    }

    const startTime = new Date(`2000-01-01T${this.availability.horaInicio}`);
    const endTime = new Date(`2000-01-01T${this.availability.horaFin}`);
    
    this.availability.bloquesDisponibles = this.allTimeSlots.filter(slot => {
      const slotTime = new Date(`2000-01-01T${slot}`);
      return slotTime >= startTime && slotTime < endTime;
    });
  }

  toggleTimeSlot(slot: string) {
    const index = this.availability.bloquesDisponibles.indexOf(slot);
    if (index > -1) {
      this.availability.bloquesDisponibles.splice(index, 1);
    } else {
      this.availability.bloquesDisponibles.push(slot);
    }
  }

  isTimeSlotSelected(slot: string): boolean {
    return this.availability.bloquesDisponibles.includes(slot);
  }

  isTimeSlotInRange(slot: string): boolean {
    if (!this.availability.horaInicio || !this.availability.horaFin) {
      return false;
    }

    const startTime = new Date(`2000-01-01T${this.availability.horaInicio}`);
    const endTime = new Date(`2000-01-01T${this.availability.horaFin}`);
    const slotTime = new Date(`2000-01-01T${slot}`);
    
    return slotTime >= startTime && slotTime < endTime;
  }

  onSubmit() {
    // Aquí irá la lógica para guardar la disponibilidad
    console.log('Disponibilidad a actualizar:', this.availability);
    // Por ahora solo redirigimos
    this.router.navigate(['/disponibilidad']);
  }

  onCancel() {
    this.router.navigate(['/disponibilidad']);
  }

  showComingSoon() {
    alert('Funcionalidad próximamente disponible');
  }
} 