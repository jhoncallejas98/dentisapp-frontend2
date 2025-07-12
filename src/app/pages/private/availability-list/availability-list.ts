import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';
import { AvailabilityServices } from '../../../services/availability-services';

@Component({
  selector: 'app-availability-list',
  standalone: true,
  imports: [CommonModule, AsideBar],
  templateUrl: './availability-list.html',
  styleUrls: ['./availability-list.css']
})
export class AvailabilityList {
  availabilities: any[] = [];

  constructor(public router: Router, private availabilityServices: AvailabilityServices) {
    this.loadAvailabilities();
  }

  loadAvailabilities() {
    (this.availabilityServices as any).getAllAvailabilities().subscribe({
      next: (data: any) => {
        this.availabilities = Array.isArray(data) ? data : (data.availabilities || []);
      },
      error: () => {
        this.availabilities = [];
      }
    });
  }

  editAvailability(availabilityId: string) {
    this.router.navigate(['/disponibilidad', availabilityId]);
  }

  deleteAvailability(availabilityId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta disponibilidad?')) {
      (this.availabilityServices as any).deleteAvailability(availabilityId).subscribe(() => {
        this.loadAvailabilities();
      });
    }
  }

  toggleAvailability(availabilityId: string) {
    const availability = this.availabilities.find(a => a._id === availabilityId);
    if (availability) {
      availability.activo = !availability.activo;
      (this.availabilityServices as any).updateAvailability(availabilityId, { activo: availability.activo }).subscribe(() => {
        this.loadAvailabilities();
      });
    }
  }

  addNewAvailability() {
    this.router.navigate(['/disponibilidad']);
  }

  getStatusClass(activo: boolean): string {
    return activo ? 'activo' : 'inactivo';
  }

  getStatusText(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }

  showComingSoon() {
    alert('Funcionalidad próximamente disponible');
  }
} 