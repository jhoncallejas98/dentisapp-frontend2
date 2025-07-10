import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, AsideBar],
  templateUrl: './appoiments.html',
  styleUrl: './appoiments.css'
})
export class AppointmentsComponent {
  // Aquí puedes agregar la lógica para manejar las citas
}
