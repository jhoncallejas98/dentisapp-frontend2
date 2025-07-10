import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AsideBar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  today = new Date();
}
