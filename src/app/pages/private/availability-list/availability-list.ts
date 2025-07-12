import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';
import { AvailabilityServices } from '../../../services/availability-services';
import { AuthServices } from '../../../services/auth-services';

@Component({
  selector: 'app-availability-list',
  standalone: true,
  imports: [CommonModule, AsideBar],
  templateUrl: './availability-list.html',
  styleUrls: ['./availability-list.css']
})
export class AvailabilityList {
  availabilities: any[] = [];

  constructor(
    public router: Router, 
    private availabilityServices: AvailabilityServices,
    private authServices: AuthServices
  ) {
    this.loadAvailabilities();
  }

  loadAvailabilities() {
    // Obtener la cédula del doctor actual
    const currentUser = this.authServices.getCurrentUser();
    const doctorCedula = currentUser?.cedula;
    
    if (!doctorCedula) {
      console.error('No se pudo obtener la cédula del doctor actual');
      return;
    }

    (this.availabilityServices as any).getAllAvailabilities().subscribe({
      next: (data: any) => {
        const allAvailabilities = Array.isArray(data) ? data : (data.availabilities || []);
        
        // Filtrar disponibilidades por el doctor actual
        this.availabilities = allAvailabilities.filter((availability: any) => {
          const availabilityDoctorCedula = availability.dentist?.cedula || 
                                          availability.cedulaDentista || 
                                          availability.dentistId;
          return availabilityDoctorCedula === doctorCedula;
        });
        
        console.log('Disponibilidades filtradas por doctor:', this.availabilities);
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