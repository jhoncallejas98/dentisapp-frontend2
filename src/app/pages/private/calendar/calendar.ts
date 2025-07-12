import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';
import { AppoimentsServices } from '../../../services/appoiments-services';

interface Appointment {
  id: string;
  date: string; // formato YYYY-MM-DD
  time: string;
  patientName: string;
  treatment: string;
  status: string;
}

interface WeekDay {
  name: string;
  date: string; // formato YYYY-MM-DD
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, AsideBar],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class CalendarComponent implements OnInit {
  currentWeekOffset = 0; // 0 = semana actual, -1 = anterior, +1 = siguiente
  timeSlots = [
    '08:00', '08:20', '08:40', '09:00', '09:20', '09:40', '10:00', '10:20', '10:40', '11:00', '11:20', '11:40',
    '12:00', '12:20', '12:40', '13:00', '13:20', '13:40', '14:00', '14:20', '14:40', '15:00', '15:20', '15:40',
    '16:00', '16:20', '16:40', '17:00', '17:20', '17:40'
  ];
  weekDays: WeekDay[] = [];
  appointments: Appointment[] = [];

  constructor(private appoimentsService: AppoimentsServices) {}

  ngOnInit(): void {
    this.generateWeekDays();
    this.loadAppointments();
  }

  generateWeekDays() {
    const today = new Date();
    // Calcular el lunes de la semana actual + offset
    const monday = new Date(today);
    const dayOfWeek = monday.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7; // 0=Monday, 6=Sunday
    monday.setDate(monday.getDate() - diffToMonday + this.currentWeekOffset * 7);
    this.weekDays = [];
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      this.weekDays.push({
        name: dayNames[i],
        date: `${yyyy}-${mm}-${dd}`
      });
    }
  }

  loadAppointments() {
    this.appoimentsService.getAppoiments().subscribe({
      next: (data: any) => {
        const citas = Array.isArray(data) ? data : (data.citas || []);
        this.appointments = citas.map((cita: any) => {
          const date = cita.date ? cita.date.substring(0, 10) : '';
          return {
            id: cita._id,
            date,
            time: cita.timeBlock,
            patientName: cita.patient?.name || cita.patient,
            treatment: cita.reason,
            status: cita.status
          };
        });
      },
      error: (err) => {
        console.error('Error cargando citas para el calendario', err);
        this.appointments = [];
      }
    });
  }

  get currentWeekText(): string {
    if (this.weekDays.length === 0) return '';
    const first = this.weekDays[0].date;
    const last = this.weekDays[6].date;
    return `${first} - ${last}`;
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
    this.currentWeekOffset--;
    this.generateWeekDays();
  }

  nextWeek(): void {
    this.currentWeekOffset++;
    this.generateWeekDays();
  }
} 