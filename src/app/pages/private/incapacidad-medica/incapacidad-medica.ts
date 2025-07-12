import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideBar } from "../../../components/aside-bar-dentist/aside-bar";
import { FormsModule } from '@angular/forms';
import { IncapacidadMedicaServices } from '../../../services/incapacidad-medica-services';
import { AuthServices } from '../../../services/auth-services';

@Component({
  selector: 'app-incapacidad-medica',
  imports: [CommonModule, AsideBar, FormsModule],
  templateUrl: './incapacidad-medica.html',
  styleUrl: './incapacidad-medica.css'
})
export class IncapacidadMedica implements OnInit {
  incapacidades: any[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  // Formulario para nueva incapacidad
  showForm = false;
  incapacidadForm = {
    cedulaPaciente: '',
    fechaInicio: '',
    fechaFin: '',
    diasIncapacidad: '',
    diagnostico: '',
    tipoIncapacidad: '',
    observaciones: ''
  };

  // Filtros
  filtroCedula = '';
  filtroTipo = '';

  constructor(
    private incapacidadMedicaService: IncapacidadMedicaServices,
    private authServices: AuthServices
  ) {}

  ngOnInit() {
    this.cargarIncapacidades();
  }

  cargarIncapacidades() {
    this.loading = true;
    this.errorMessage = '';

    this.incapacidadMedicaService.getAllIncapacidadesMedicas().subscribe({
      next: (data: any) => {
        console.log('Incapacidades cargadas:', data);
        this.incapacidades = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando incapacidades:', err);
        this.errorMessage = 'Error al cargar las incapacidades médicas';
        this.loading = false;
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.limpiarFormulario();
    }
  }

  calcularDiasIncapacidad() {
    if (this.incapacidadForm.fechaInicio && this.incapacidadForm.fechaFin) {
      const inicio = new Date(this.incapacidadForm.fechaInicio);
      const fin = new Date(this.incapacidadForm.fechaFin);
      const diffTime = Math.abs(fin.getTime() - inicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días
      this.incapacidadForm.diasIncapacidad = diffDays.toString();
    }
  }

  guardarIncapacidad() {
    if (!this.incapacidadForm.cedulaPaciente || !this.incapacidadForm.fechaInicio || 
        !this.incapacidadForm.fechaFin || !this.incapacidadForm.diagnostico) {
      this.errorMessage = 'Por favor complete todos los campos obligatorios';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.incapacidadMedicaService.createIncapacidadMedica(this.incapacidadForm).subscribe({
      next: (response) => {
        console.log('Incapacidad guardada exitosamente:', response);
        this.successMessage = 'Incapacidad médica guardada exitosamente';
        this.limpiarFormulario();
        this.showForm = false;
        this.cargarIncapacidades();
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error guardando incapacidad:', err);
        this.errorMessage = 'Error al guardar la incapacidad médica';
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  eliminarIncapacidad(id: string) {
    if (confirm('¿Está seguro de que desea eliminar esta incapacidad médica?')) {
      this.loading = true;
      this.errorMessage = '';

      this.incapacidadMedicaService.removeIncapacidadMedicaById(id).subscribe({
        next: (response) => {
          console.log('Incapacidad eliminada exitosamente:', response);
          this.successMessage = 'Incapacidad médica eliminada exitosamente';
          this.cargarIncapacidades();
          
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('Error eliminando incapacidad:', err);
          this.errorMessage = 'Error al eliminar la incapacidad médica';
          
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  limpiarFormulario() {
    this.incapacidadForm = {
      cedulaPaciente: '',
      fechaInicio: '',
      fechaFin: '',
      diasIncapacidad: '',
      diagnostico: '',
      tipoIncapacidad: '',
      observaciones: ''
    };
  }

  // Filtros
  get incapacidadesFiltradas() {
    let filtradas = this.incapacidades;

    if (this.filtroCedula) {
      filtradas = filtradas.filter(inc => 
        inc.cedulaPaciente?.toLowerCase().includes(this.filtroCedula.toLowerCase()) ||
        inc.documentId?.toLowerCase().includes(this.filtroCedula.toLowerCase())
      );
    }

    if (this.filtroTipo) {
      filtradas = filtradas.filter(inc => 
        inc.tipoIncapacidad?.toLowerCase().includes(this.filtroTipo.toLowerCase())
      );
    }

    return filtradas;
  }

  limpiarFiltros() {
    this.filtroCedula = '';
    this.filtroTipo = '';
  }

  // Formateo de fechas
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES');
  }
} 