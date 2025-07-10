import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';

interface Patient {
  initials: string;
  name: string;
  document: string;
  phone: string;
  status: string;
  statusText: string;
}

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AsideBar],
  templateUrl: './patients-list.html',
  styleUrl: './patients-list.css'
})
export class PatientsListComponent {
  patients: Patient[] = [
    {
      initials: 'LG',
      name: 'Laura Garzón',
      document: '1022465873',
      phone: '+57 300 123 4567',
      status: 'active',
      statusText: 'Activo'
    },
    {
      initials: 'VG',
      name: 'Valentina García',
      document: '98362792',
      phone: '+57 310 987 6543',
      status: 'active',
      statusText: 'Activo'
    },
    {
      initials: 'AP',
      name: 'Andrés Pastrana',
      document: '29376252',
      phone: '+57 315 555 1234',
      status: 'inactive',
      statusText: 'Inactivo'
    },
    {
      initials: 'MG',
      name: 'María González',
      document: '45678912',
      phone: '+57 320 456 7890',
      status: 'active',
      statusText: 'Activo'
    },
    {
      initials: 'CR',
      name: 'Carlos Rodríguez',
      document: '78912345',
      phone: '+57 311 789 1234',
      status: 'pending',
      statusText: 'Pendiente'
    }
  ];
} 