import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AsideUsers } from "../../../components/aside-users/aside-users";
import { AuthServices } from '../../../services/auth-services';
import { AppoimentsServices } from '../../../services/appoiments-services';
import { DentistServices } from '../../../services/dentist-services';

@Component({
  selector: 'app-appoiment-users',
  imports: [AsideUsers, CommonModule],
  templateUrl: './appoiment-users.html',
  styleUrl: './appoiment-users.css'
})
export class AppoimentUsers implements OnInit {
  appointments: any[] = [];
  loading: boolean = true;
  error: string = '';
  currentUser: any = null;
  dentists: any[] = [];

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
    // Si la cita está cancelada, siempre mostrar como cancelada
    if (status?.toLowerCase() === 'cancelada' || status?.toLowerCase() === 'cancelled') {
      return 'cancelada';
    }
    
    // Si la cita está marcada como asistió, siempre mostrar como asistió
    if (status?.toLowerCase() === 'asistio' || status?.toLowerCase() === 'attended') {
      return 'asistio';
    }
    
    // Para citas pendientes, verificar si la fecha ya pasó
    if (status?.toLowerCase() === 'pendiente' || status?.toLowerCase() === 'pending') {
      return 'pendiente';
    }
    
    return 'pendiente';
  }

  getStatusText(status: string, appointmentDate?: string): string {
    // Si la cita está cancelada, siempre mostrar como cancelada
    if (status?.toLowerCase() === 'cancelada' || status?.toLowerCase() === 'cancelled') {
      return 'Cancelada';
    }
    
    // Si la cita está marcada como asistió, siempre mostrar como asistió
    if (status?.toLowerCase() === 'asistio' || status?.toLowerCase() === 'attended') {
      return 'Asistió';
    }
    
    // Para citas pendientes, verificar si la fecha ya pasó
    if (status?.toLowerCase() === 'pendiente' || status?.toLowerCase() === 'pending') {
      if (appointmentDate) {
        const appointmentDateTime = new Date(appointmentDate);
        const now = new Date();
        
        // Si la fecha de la cita ya pasó, mostrar como "Pasada"
        if (appointmentDateTime < now) {
          return 'Pasada';
        }
      }
      return 'Pendiente';
    }
    
    return 'Pendiente';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return 'Fecha no válida';
    }
  }

  formatTime(dateString: string): string {
    if (!dateString) return 'Hora no disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Hora no válida';
    }
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
    
    // Buscar en la lista de dentistas por cédula
    const dentistCedula = appointment.cedulaDentista || appointment.dentistId;
    if (dentistCedula && this.dentists.length > 0) {
      const dentist = this.dentists.find(d => d.cedula === dentistCedula);
      if (dentist && dentist.name) return dentist.name;
    }
    
    return 'No especificado';
  }

  viewAppointment(appointment: any) {
    // Aquí podrías implementar la lógica para ver detalles de la cita
    console.log('Ver detalles de la cita:', appointment);
    // Por ahora solo mostramos un alert
    alert(`Detalles de la cita:\nFecha: ${this.formatDate(appointment.date)}\nHora: ${this.formatTime(appointment.date)}\nDoctor: ${this.getDentistName(appointment)}\nMotivo: ${appointment.reason || 'No especificado'}`);
  }

  cancelAppointment(appointmentId: string, appointmentDate: string) {
    // Verificar si la fecha de la cita ya pasó
    const appointmentDateTime = new Date(appointmentDate);
    const now = new Date();
    
    if (appointmentDateTime < now) {
      alert('No puedes cancelar una cita que ya pasó.');
      return;
    }
    
    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      this.appoimentsServices.updateAppoiment(appointmentId, { status: 'cancelada' }).subscribe({
        next: (response: any) => {
          console.log('Cita cancelada exitosamente:', response);
          // Recargar las citas
          this.loadUserAppointments();
        },
        error: (error: any) => {
          console.error('Error al cancelar la cita:', error);
          alert('Error al cancelar la cita. Por favor, intenta nuevamente.');
        }
      });
    }
  }
}
