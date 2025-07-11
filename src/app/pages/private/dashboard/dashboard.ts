import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';

interface TodayPatient {
  initials: string;
  name: string;
  time: string;
  treatment: string;
  status: string;
  statusText: string;
}

interface UpcomingAppointment {
  time: string;
  date: string;
  patientName: string;
  treatment: string;
  duration: number;
  status: string;
  statusText: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AsideBar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  today = new Date();
  
  todayPatients: TodayPatient[] = [
    {
      initials: 'LG',
      name: 'Laura Garzón',
      time: '07:20',
      treatment: 'Limpieza dental',
      status: 'confirmed',
      statusText: 'Asistió'
    },
    {
      initials: 'VG',
      name: 'Valentina García',
      time: '10:30',
      treatment: 'Consulta general',
      status: 'pending',
      statusText: 'Pendiente'
    },
    {
      initials: 'AP',
      name: 'Andrés Pastrana',
      time: '14:00',
      treatment: 'Extracción',
      status: 'cancelled',
      statusText: 'Cancelada'
    },
    {
      initials: 'MC',
      name: 'María Cortés',
      time: '16:30',
      treatment: 'Ortodoncia',
      status: 'completed',
      statusText: 'Completada'
    }
  ];

  upcomingAppointments: UpcomingAppointment[] = [
    {
      time: '09:00',
      date: 'Mañana',
      patientName: 'Carlos Rodríguez',
      treatment: 'Consulta general',
      duration: 30,
      status: 'confirmed',
      statusText: 'Confirmada'
    },
    {
      time: '11:30',
      date: 'Mañana',
      patientName: 'Ana Martínez',
      treatment: 'Limpieza dental',
      duration: 45,
      status: 'pending',
      statusText: 'Pendiente'
    },
    {
      time: '15:00',
      date: 'Tarde',
      patientName: 'Roberto Silva',
      treatment: 'Extracción',
      duration: 60,
      status: 'confirmed',
      statusText: 'Confirmada'
    }
  ];

  // Métodos para las estadísticas
  getTotalPatients(): number {
    return 156; // Simulado
  }

  getTodayAppointments(): number {
    return this.todayPatients.length;
  }

  getCompletedAppointments(): number {
    return this.todayPatients.filter(p => p.status === 'completed').length;
  }

  getPendingAppointments(): number {
    return this.todayPatients.filter(p => p.status === 'pending').length;
  }
}
