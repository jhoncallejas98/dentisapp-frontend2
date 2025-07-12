import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';
import { AppoimentsServices } from '../../../services/appoiments-services';
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

  constructor(private appoimentsService: AppoimentsServices, private router: Router) {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appoimentsService.getAppoiments().subscribe({
      next: (data: any) => {
        // Soporta respuesta como { citas: [...] } o array directo
        if (Array.isArray(data)) {
          this.appointments = data;
        } else if (data && Array.isArray(data.citas)) {
          this.appointments = data.citas;
        } else {
          this.appointments = [];
        }
      },
      error: (err) => {
        console.error('Error cargando citas', err);
        this.appointments = [];
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
