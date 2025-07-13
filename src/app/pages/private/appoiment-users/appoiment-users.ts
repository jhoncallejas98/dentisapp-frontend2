import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthServices } from '../../../services/auth-services';
import { AppoimentsServices } from '../../../services/appoiments-services';
import { DentistServices } from '../../../services/dentist-services';
import { formatToDDMMYYYY, extractHourFromISO } from '../../../services/date-utils.service';

@Component({
  selector: 'app-appoiment-users',
  imports: [CommonModule, RouterModule],
  templateUrl: './appoiment-users.html',
  styleUrl: './appoiment-users.css'
})
export class AppoimentUsers implements OnInit {
  appointments: any[] = [];
  loading: boolean = true;
  error: string = '';
  currentUser: any = null;
  dentists: any[] = [];
  formatToDDMMYYYY = formatToDDMMYYYY;
  extractHourFromISO = extractHourFromISO;

  constructor(
    private authServices: AuthServices,
    private appoimentsServices: AppoimentsServices,
    private dentistService: DentistServices,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadDentists();
    this.loadUserAppointments();
  }

  loadCurrentUser() {
    this.currentUser = this.authServices.getCurrentUser();
    console.log('Usuario actual:', this.currentUser);
  }

  loadDentists() {
    this.dentistService.getDentist().subscribe({
      next: (data) => {
        console.log('Dentistas obtenidos:', data);
        this.dentists = Array.isArray(data) ? data : [];
      },
      error: (error) => {
        console.error('Error al cargar dentistas:', error);
        this.dentists = [];
      }
    });
  }

  loadUserAppointments() {
    this.loading = true;
    this.error = '';
    const appointmentsObservable = this.authServices.getUserAppointments();
    if (!appointmentsObservable) {
      this.error = 'No se pudo obtener la información del usuario';
      this.loading = false;
      return;
    }
    appointmentsObservable.subscribe({
      next: (data: any) => {
        console.log('Citas obtenidas:', data);
        this.appointments = Array.isArray(data) ? data : [];
        // Ordenar citas por fecha (más recientes primero)
        this.appointments.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando citas:', err);
        this.error = 'Error al cargar las citas. Por favor, verifica tu conexión.';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    if (status?.toLowerCase() === 'cancelada' || status?.toLowerCase() === 'cancelled') {
      return 'cancelada';
    }
    if (status?.toLowerCase() === 'asistio' || status?.toLowerCase() === 'attended') {
      return 'asistio';
    }
    if (status?.toLowerCase() === 'pendiente' || status?.toLowerCase() === 'pending') {
      return 'pendiente';
    }
    return 'pendiente';
  }

  getStatusText(status: string, appointmentDate?: string): string {
    if (status?.toLowerCase() === 'cancelada' || status?.toLowerCase() === 'cancelled') {
      return 'Cancelada';
    }
    if (status?.toLowerCase() === 'asistio' || status?.toLowerCase() === 'attended') {
      return 'Asistió';
    }
    if (status?.toLowerCase() === 'pendiente' || status?.toLowerCase() === 'pending') {
      if (appointmentDate) {
        const appointmentDateTime = new Date(appointmentDate);
        const now = new Date();
        if (appointmentDateTime < now) {
          return 'Pasada';
        }
      }
      return 'Pendiente';
    }
    return 'Pendiente';
  }

  isPastAppointment(appointmentDate: string): boolean {
    if (!appointmentDate) return false;
    try {
      const appointmentDateTime = new Date(appointmentDate);
      const now = new Date();
      return appointmentDateTime < now;
    } catch {
      return false;
    }
  }

  getCancelButtonTitle(appointment: any): string {
    if (appointment.status === 'cancelada' || appointment.status === 'cancelled') {
      return 'Cita ya cancelada';
    }
    if (this.isPastAppointment(appointment.date)) {
      return 'No puedes cancelar una cita que ya pasó';
    }
    return 'Cancelar cita';
  }

  getDentistName(appointment: any): string {
    if (appointment.dentistName) return appointment.dentistName;
    if (appointment.dentist && appointment.dentist.name) return appointment.dentist.name;
    if (appointment.doctorName) return appointment.doctorName;
    const dentistCedula = appointment.cedulaDentista || appointment.dentistId;
    if (dentistCedula && this.dentists.length > 0) {
      const dentist = this.dentists.find(d => d.cedula === dentistCedula);
      if (dentist && dentist.name) return dentist.name;
    }
    return 'No especificado';
  }

  viewAppointment(appointment: any) {
    alert(`Detalles de la cita:\nFecha: ${this.formatToDDMMYYYY(appointment.date)}\nHora: ${this.extractHourFromISO(appointment.date) || appointment.timeBlock}\nDoctor: ${this.getDentistName(appointment)}\nMotivo: ${appointment.reason || 'No especificado'}`);
  }

  cancelAppointment(appointmentId: string, appointmentDate: string) {
    const appointmentDateTime = new Date(appointmentDate);
    const now = new Date();
    if (appointmentDateTime < now) {
      alert('No puedes cancelar una cita que ya pasó.');
      return;
    }
    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      this.appoimentsServices.updateAppoiment(appointmentId, { status: 'cancelada' }).subscribe({
        next: (response: any) => {
          this.loadUserAppointments();
        },
        error: (error: any) => {
          alert('Error al cancelar la cita. Por favor, intenta nuevamente.');
        }
      });
    }
  }
}
