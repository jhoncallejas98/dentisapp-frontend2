import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';

interface TodayPatient {
  initials: string;
  name: string;
  time: string;
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
      status: 'confirmed',
      statusText: 'Asistió'
    },
    {
      initials: 'VG',
      name: 'Valentina García',
      time: '10:30',
      status: 'pending',
      statusText: 'Pendiente'
    },
    {
      initials: 'AP',
      name: 'Andrés Pastrana',
      time: '14:00',
      status: 'cancelled',
      statusText: 'Cancelada'
    }
  ];
}
