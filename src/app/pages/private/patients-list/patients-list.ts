import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  imports: [CommonModule, RouterModule],
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

  getPatientInitial(name: string): string {
    if (!name) return '?';
    
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
  }
} 