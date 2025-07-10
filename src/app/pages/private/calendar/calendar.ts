import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';

interface Appointment {
  id: number;
  date: string;
  time: string;
  patientName: string;
  treatment: string;
  status: string;
}

interface WeekDay {
  name: string;
  date: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, AsideBar],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class CalendarComponent {
  currentWeek = 0;
  timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  
  weekDays: WeekDay[] = [
    { name: 'Lun', date: '15' },
    { name: 'Mar', date: '16' },
    { name: 'Mié', date: '17' },
    { name: 'Jue', date: '18' },
    { name: 'Vie', date: '19' },
    { name: 'Sáb', date: '20' },
    { name: 'Dom', date: '21' }
  ];

  appointments: Appointment[] = [
    {
      id: 1,
      date: '15',
      time: '09:00',
      patientName: 'María González',
      treatment: 'Ortodoncia',
      status: 'confirmed'
    },
    {
      id: 2,
      date: '15',
      time: '14:00',
      patientName: 'Carlos Rodríguez',
      treatment: 'Limpieza',
      status: 'pending'
    },
    {
      id: 3,
      date: '16',
      time: '10:00',
      patientName: 'Ana Pérez',
      treatment: 'Consulta',
      status: 'confirmed'
    },
    {
      id: 4,
      date: '17',
      time: '15:00',
      patientName: 'Laura Garzón',
      treatment: 'Extracción',
      status: 'cancelled'
    },
    {
      id: 5,
      date: '18',
      time: '11:00',
      patientName: 'Valentina García',
      treatment: 'Ortodoncia',
      status: 'completed'
    }
  ];

  get currentWeekText(): string {
    return '15 - 21 Enero 2024';
  }

  getAppointmentsForDayAndTime(date: string, time: string): Appointment[] {
    return this.appointments.filter(appointment => 
      appointment.date === date && appointment.time === time
    );
  }

  getTotalAppointments(): number {
    return this.appointments.length;
  }

  getConfirmedAppointments(): number {
    return this.appointments.filter(a => a.status === 'confirmed').length;
  }

  getPendingAppointments(): number {
    return this.appointments.filter(a => a.status === 'pending').length;
  }

  previousWeek(): void {
    this.currentWeek--;
    // Aquí actualizarías las fechas de la semana
  }

  nextWeek(): void {
    this.currentWeek++;
    // Aquí actualizarías las fechas de la semana
  }
} 