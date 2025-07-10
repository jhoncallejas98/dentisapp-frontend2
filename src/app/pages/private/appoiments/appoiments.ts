import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';

interface Appointment {
  time: string;
  date: string;
  initials: string;
  patientName: string;
  treatment: string;
  status: string;
  statusText: string;
}

@Component({
  selector: 'app-appoiments',
  standalone: true,
  imports: [CommonModule, RouterModule, AsideBar],
  templateUrl: './appoiments.html',
  styleUrl: './appoiments.css'
})
export class AppoimentsComponent {
  appointments: Appointment[] = [
    {
      time: '09:00',
      date: 'Hoy',
      initials: 'MG',
      patientName: 'María González',
      treatment: 'Ortodoncia - Ajuste de brackets',
      status: 'confirmed',
      statusText: 'Confirmada'
    },
    {
      time: '11:30',
      date: 'Hoy',
      initials: 'CR',
      patientName: 'Carlos Rodríguez',
      treatment: 'Limpieza dental profunda',
      status: 'pending',
      statusText: 'Pendiente'
    },
    {
      time: '15:00',
      date: 'Hoy',
      initials: 'AP',
      patientName: 'Ana Pérez',
      treatment: 'Extracción de muela del juicio',
      status: 'cancelled',
      statusText: 'Cancelada'
    },
    {
      time: '17:30',
      date: 'Hoy',
      initials: 'LG',
      patientName: 'Laura Garzón',
      treatment: 'Consulta de rutina',
      status: 'completed',
      statusText: 'Completada'
    }
  ];
}
