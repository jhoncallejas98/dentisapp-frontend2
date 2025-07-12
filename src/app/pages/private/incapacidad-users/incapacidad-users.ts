import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AsideUsers } from "../../../components/aside-users/aside-users";
import { AuthServices } from '../../../services/auth-services';
import { IncapacidadMedicaServices } from '../../../services/incapacidad-medica-services';

@Component({
  selector: 'app-incapacidad-users',
  imports: [AsideUsers, CommonModule],
  templateUrl: './incapacidad-users.html',
  styleUrl: './incapacidad-users.css'
})
export class IncapacidadUsers implements OnInit {
  // Datos del usuario
  userCedula: string = '';
  
  // Datos de incapacidades
  incapacities: any[] = [];
  filteredIncapacities: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authServices: AuthServices,
    private incapacidadMedicaService: IncapacidadMedicaServices
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadIncapacities();
  }

  loadUserData() {
    const cedula = this.authServices.getCurrentUserCedula();
    this.userCedula = cedula || '';
    if (!this.userCedula) {
      this.error = 'No se pudo obtener la información del usuario';
      this.loading = false;
    }
  }

  loadIncapacities() {
    this.loading = true;
    this.error = '';

    this.incapacidadMedicaService.getAllIncapacidadesMedicas().subscribe({
      next: (data: any) => {
        console.log('Todas las incapacidades obtenidas:', data);
        
        // Filtrar incapacidades del usuario actual
        const incapacidadesArray = Array.isArray(data) ? data : [];
        this.incapacities = incapacidadesArray.filter((inc: any) => 
          inc.cedulaPaciente === this.userCedula || 
          inc.documentId === this.userCedula ||
          inc.patientCedula === this.userCedula
        );
        
        // Ordenar por fecha de inicio (más recientes primero)
        this.incapacities.sort((a: any, b: any) => {
          return new Date(b.fechaInicio || b.date).getTime() - new Date(a.fechaInicio || a.date).getTime();
        });
        
        // Asignar directamente a filteredIncapacities
        this.filteredIncapacities = this.incapacities;
        
        console.log('Incapacidades filtradas del usuario:', this.incapacities);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando incapacidades:', err);
        this.error = 'Error al cargar las incapacidades: ' + (err.message || 'Error desconocido');
        this.loading = false;
      }
    });
  }

  getStatusClass(incapacidad: any): string {
    const today = new Date();
    const fechaFin = new Date(incapacidad.fechaFin);
    
    if (fechaFin >= today) {
      return 'status-activa';
    } else {
      return 'status-finalizada';
    }
  }

  getStatusText(incapacidad: any): string {
    const today = new Date();
    const fechaFin = new Date(incapacidad.fechaFin);
    
    if (fechaFin >= today) {
      return 'Activa';
    } else {
      return 'Finalizada';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return 'Fecha no válida';
    }
  }
} 