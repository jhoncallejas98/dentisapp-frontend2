import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';
import { AuthServices } from '../../../services/auth-services';

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
export class PatientsListComponent implements OnInit {
  patients: any[] = [];

  constructor(private authServices: AuthServices) {}

  ngOnInit() {
    this.authServices.getAllUsers().subscribe({
      next: (users: any) => {
        this.patients = Array.isArray(users) ? users.filter(u => u.role === 'patient') : [];
      },
      error: () => {
        this.patients = [];
      }
    });
  }
} 