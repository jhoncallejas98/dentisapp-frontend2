import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';
import { DentistServices } from '../../../services/dentist-services';
import { AvailabilityServices } from '../../../services/availability-services';

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
    dentist: '',
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
  doctors: any[] = [];
  successMessage = '';
  errorMessage = '';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private dentistServices: DentistServices,
    private availabilityServices: AvailabilityServices
  ) {}

  ngOnInit() {
    // Obtener el ID del usuario logueado (doctor)
    const userId = localStorage.getItem('userId');
    this.availability.dentist = userId || '';
    const availabilityId = this.route.snapshot.params['id'];
    if (availabilityId) {
      this.loadAvailability(availabilityId);
    }
  }

  loadAvailability(id: string) {
    // Aquí irá la lógica para cargar la disponibilidad desde el backend
    // Por ahora simulamos datos
    this.availability = {
      id: parseInt(id),
      dentist: '',
      diaSemana: 'Lunes',
      horaInicio: '08:00',
      horaFin: '17:00',
      bloquesDisponibles: ['08:00', '08:20', '08:40', '09:00', '09:20', '09:40'],
      activo: true
    };
  }

  onTimeRangeChange() {
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
    this.successMessage = '';
    this.errorMessage = '';
    // Validación extra para horaFin
    if (!this.availability.horaFin) {
      this.errorMessage = 'Debes seleccionar la hora de fin.';
      return;
    }
    // Guardar la disponibilidad en el backend
    const payload = {
      dentist: this.availability.dentist,
      diaSemana: this.availability.diaSemana,
      horaInicio: this.availability.horaInicio,
      horaFin: this.availability.horaFin,
      bloquesDisponibles: this.availability.bloquesDisponibles,
      activo: this.availability.activo
    };
    console.log('Payload enviado:', payload);
    if (!payload.horaFin) {
      this.errorMessage = 'El campo horaFin no está definido. Revisa el formulario.';
      return;
    }
    (this.availabilityServices as any).createOrUpdateAvailability(payload).subscribe({
      next: () => {
        this.successMessage = 'Disponibilidad guardada correctamente.';
        setTimeout(() => {
          this.router.navigate(['/admin/availability']);
        }, 1200);
      },
      error: (err: any) => {
        this.errorMessage = 'Error guardando disponibilidad: ' + (err?.error?.msg || err.message);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/admin/availability']);
  }

  showComingSoon() {
    alert('Funcionalidad próximamente disponible');
  }
} 