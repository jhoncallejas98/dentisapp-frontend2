import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideUsers } from "../../../components/aside-users/aside-users";
import { AuthServices } from '../../../services/auth-services';
import { FormulaMedicaServices } from '../../../services/formula-medica-services';
import { DentistServices } from '../../../services/dentist-services';

@Component({
  selector: 'app-formula-users',
  imports: [AsideUsers, CommonModule],
  templateUrl: './formula-users.html',
  styleUrl: './formula-users.css'
})
export class FormulaUsers implements OnInit {
  formulas: any[] = [];
  loading: boolean = true;
  error: string = '';
  userCedula: string = '';
  dentists: any[] = []; // Added dentists property

  constructor(
    private authServices: AuthServices,
    private formulaServices: FormulaMedicaServices,
    private dentistServices: DentistServices // Added DentistServices to constructor
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadDentists();
    this.loadFormulas();
  }

  loadUserData() {
    const cedula = this.authServices.getCurrentUserCedula();
    this.userCedula = cedula || '';
    if (!this.userCedula) {
      this.error = 'No se pudo obtener la información del usuario';
      this.loading = false;
    }
  }

  loadDentists() {
    this.dentistServices.getDentist().subscribe({
      next: (data) => {
        console.log('Dentistas obtenidos:', data);
        this.dentists = Array.isArray(data) ? data : [];
      },
      error: (error) => {
        console.error('Error al cargar dentistas:', error);
        this.dentists = [];
      }
    });
  }

  loadFormulas() {
    this.loading = true;
    this.error = '';
    
    this.formulaServices.getFormulas().subscribe({
      next: (data: any) => {
        console.log('Todas las fórmulas obtenidas:', data);
        
        // Filtrar por el paciente actual
        const formulasArray = Array.isArray(data) ? data : [];
        this.formulas = formulasArray.filter((formula: any) => 
          formula.patient === this.userCedula || 
          formula.patientId === this.userCedula ||
          formula.cedulaPaciente === this.userCedula ||
          formula.documentId === this.userCedula
        );
        
        // Ordenar por fecha (más recientes primero)
        this.formulas.sort((a: any, b: any) => {
          return new Date(b.fecha || b.date).getTime() - new Date(a.fecha || a.date).getTime();
        });
        
        console.log('Fórmulas filtradas del usuario:', this.formulas);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando fórmulas:', err);
        this.error = 'Error al cargar las fórmulas médicas: ' + (err.message || 'Error desconocido');
        this.loading = false;
      }
    });
  }

  getDentistName(formula: any): string {
    if (formula.dentistName) return formula.dentistName;
    if (formula.dentist && formula.dentist.name) return formula.dentist.name;
    if (formula.doctorName) return formula.doctorName;
    
    // Buscar en la lista de dentistas por cédula
    const dentistCedula = formula.cedulaDentista || formula.dentistId;
    if (dentistCedula && this.dentists.length > 0) {
      const dentist = this.dentists.find(d => d.cedula === dentistCedula);
      if (dentist && dentist.name) return dentist.name;
    }
    
    return 'No especificado';
  }

  getStatusText(formula: any): string {
    const today = new Date();
    const expirationDate = this.getExpirationDate(formula, true);
    
    if (expirationDate && new Date(expirationDate) >= today) {
      return 'Válida';
    } else {
      return 'Expirada';
    }
  }

  getExpirationDate(formula: any, returnDate: boolean = false): string {
    const prescriptionDate = new Date(formula.fecha || formula.date);
    const durationDays = formula.duracionDias || formula.duration || 0;
    
    if (durationDays > 0) {
      const expirationDate = new Date(prescriptionDate);
      expirationDate.setDate(expirationDate.getDate() + durationDays);
      
      if (returnDate) {
        return expirationDate.toISOString();
      }
      
      return this.formatDate(expirationDate.toISOString());
    }
    
    return 'No especificada';
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
