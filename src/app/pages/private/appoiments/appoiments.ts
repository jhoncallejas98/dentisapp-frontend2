import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';
import { AppoimentsServices } from '../../../services/appoiments-services';
import { AuthServices } from '../../../services/auth-services';
import { Router } from '@angular/router';

interface Appointment {
  _id: string;
  patient: any;
  dentist: any;
  date: string;
  timeBlock: string;
  reason: string;
  notes?: string;
  status: string;
}

@Component({
  selector: 'app-appoiments',
  standalone: true,
  imports: [CommonModule, RouterModule, AsideBar],
  templateUrl: './appoiments.html',
  styleUrl: './appoiments.css'
})
export class AppoimentsComponent {
  appointments: Appointment[] = [];

  constructor(
    private appoimentsService: AppoimentsServices, 
    private authServices: AuthServices,
    private router: Router
  ) {
    this.loadAppointments();
  }

  // Función helper para traducir estados de citas
  translateStatus(status: string): string {
    console.log('Traduciendo estado:', status);
    
    const statusMap: { [key: string]: string } = {
      'attended': 'Atendido',
      'completed': 'Completado',
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'cancelled': 'Cancelada',
      'asistio': 'Asistió',
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'cancelada': 'Cancelada'
    };
    
    const translatedStatus = statusMap[status?.toLowerCase()] || status;
    console.log('Estado traducido:', translatedStatus);
    return translatedStatus;
  }

  loadAppointments() {
    // Obtener la cédula del doctor actual
    const currentUser = this.authServices.getCurrentUser();
    const doctorCedula = currentUser?.cedula;
    
    if (!doctorCedula) {
      console.error('No se pudo obtener la cédula del doctor actual');
      return;
    }

    this.appoimentsService.getAppoiments().subscribe({
      next: (data: any) => {
        // Soporta respuesta como { citas: [...] } o array directo
        let allAppointments = [];
        if (Array.isArray(data)) {
          allAppointments = data;
        } else if (data && Array.isArray(data.citas)) {
          allAppointments = data.citas;
        } else {
          allAppointments = [];
        }

        // Filtrar citas por el doctor actual
        this.appointments = allAppointments.filter((appointment: any) => {
          const appointmentDoctorCedula = appointment.dentist?.cedula || 
                                         appointment.cedulaDentista || 
                                         appointment.dentistId;
          return appointmentDoctorCedula === doctorCedula;
        });

        console.log('Citas filtradas por doctor:', this.appointments);
      },
      error: (err) => {
        console.error('Error cargando citas', err);
      }
    });
  }

  deleteAppointment(id: string) {
    if (confirm('¿Seguro que deseas eliminar esta cita?')) {
      this.appoimentsService.deleteAppoiment(id).subscribe({
        next: () => {
          this.loadAppointments();
        },
        error: (err) => {
          console.error('Error eliminando cita', err);
        }
      });
    }
  }

  editAppointment(id: string) {
    this.router.navigate(['/appoiments/edit', id]);
  }
}
