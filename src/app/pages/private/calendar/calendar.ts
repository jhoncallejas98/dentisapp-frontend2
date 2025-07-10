import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';

interface Appointment {
  id: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  duration: number; // en minutos
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, AsideBar],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class Calendar implements OnInit {
  currentDate = new Date();
  selectedDate = new Date();
  appointments: Appointment[] = [];
  viewMode: 'week' | 'month' | 'day' = 'week';
  
  // Datos de ejemplo
  sampleAppointments: Appointment[] = [
    {
      id: 1,
      patientName: 'María González',
      patientEmail: 'maria.gonzalez@email.com',
      patientPhone: '300-123-4567',
      date: '2024-01-15',
      time: '09:00',
      duration: 60,
      type: 'Limpieza',
      status: 'confirmed',
      notes: 'Primera visita'
    },
    {
      id: 2,
      patientName: 'Carlos Rodríguez',
      patientEmail: 'carlos.rodriguez@email.com',
      patientPhone: '310-987-6543',
      date: '2024-01-15',
      time: '10:30',
      duration: 90,
      type: 'Extracción',
      status: 'confirmed',
      notes: 'Extracción molar'
    },
    {
      id: 3,
      patientName: 'Ana Martínez',
      patientEmail: 'ana.martinez@email.com',
      patientPhone: '315-555-1234',
      date: '2024-01-16',
      time: '14:00',
      duration: 45,
      type: 'Consulta',
      status: 'pending',
      notes: 'Revisión post-tratamiento'
    },
    {
      id: 4,
      patientName: 'Luis Pérez',
      patientEmail: 'luis.perez@email.com',
      patientPhone: '320-111-2222',
      date: '2024-01-17',
      time: '11:00',
      duration: 60,
      type: 'Ortodoncia',
      status: 'confirmed',
      notes: 'Ajuste de brackets'
    }
  ];

  constructor(public router: Router) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    // Aquí irá la lógica para cargar citas desde el backend
    this.appointments = this.sampleAppointments;
  }

  getWeekDays(): Date[] {
    const days: Date[] = [];
    const startOfWeek = new Date(this.selectedDate);
    startOfWeek.setDate(this.selectedDate.getDate() - this.selectedDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    const dateStr = this.formatDate(date);
    return this.appointments.filter(appointment => appointment.date === dateStr);
  }

  getAppointmentsForTimeSlot(date: Date, time: string): Appointment[] {
    const dateStr = this.formatDate(date);
    return this.appointments.filter(appointment => 
      appointment.date === dateStr && appointment.time === time
    );
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      case 'completed': return 'Completada';
      default: return status;
    }
  }

  getTypeColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'limpieza': return '#4CAF50';
      case 'extracción': return '#FF5722';
      case 'consulta': return '#2196F3';
      case 'ortodoncia': return '#9C27B0';
      case 'endodoncia': return '#FF9800';
      default: return '#607D8B';
    }
  }

  previousWeek() {
    this.selectedDate.setDate(this.selectedDate.getDate() - 7);
    this.selectedDate = new Date(this.selectedDate);
  }

  nextWeek() {
    this.selectedDate.setDate(this.selectedDate.getDate() + 7);
    this.selectedDate = new Date(this.selectedDate);
  }

  goToToday() {
    this.selectedDate = new Date();
  }

  selectDate(date: Date) {
    this.selectedDate = new Date(date);
  }

  viewAppointment(appointment: Appointment) {
    // Aquí irá la lógica para ver detalles de la cita
    console.log('Ver cita:', appointment);
    this.router.navigate(['/admin/appointments/view', appointment.id]);
  }

  editAppointment(appointment: Appointment) {
    // Aquí irá la lógica para editar la cita
    console.log('Editar cita:', appointment);
    this.router.navigate(['/admin/appointments/edit', appointment.id]);
  }

  cancelAppointment(appointment: Appointment) {
    if (confirm(`¿Estás seguro de que quieres cancelar la cita con ${appointment.patientName}?`)) {
      // Aquí irá la lógica para cancelar la cita
      console.log('Cancelar cita:', appointment.id);
      appointment.status = 'cancelled';
    }
  }

  addNewAppointment() {
    this.router.navigate(['/admin/appoiments/AppoimentsNewForms']);
  }

  getTimeSlots(): string[] {
    return [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30'
    ];
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  // Métodos para el resumen estadístico
  getConfirmedCount(): number {
    return this.appointments.filter(a => a.status === 'confirmed').length;
  }

  getPendingCount(): number {
    return this.appointments.filter(a => a.status === 'pending').length;
  }

  getCompletedCount(): number {
    return this.appointments.filter(a => a.status === 'completed').length;
  }

  getCancelledCount(): number {
    return this.appointments.filter(a => a.status === 'cancelled').length;
  }

  showComingSoon() {
    alert('Funcionalidad próximamente disponible');
  }
} 