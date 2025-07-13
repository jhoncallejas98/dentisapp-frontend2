import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthServices } from '../../../services/auth-services';
import { IncapacidadMedicaServices } from '../../../services/incapacidad-medica-services';
import { AppoimentsServices } from '../../../services/appoiments-services';
import { FormulaMedicaServices } from '../../../services/formula-medica-services';
import { DentistServices } from '../../../services/dentist-services';
import { formatToDDMMYYYY, extractHourFromISO } from '../../../services/date-utils.service';

@Component({
  selector: 'app-dashboard-users',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-users.html',
  styleUrl: './dashboard-users.css'
})
export class DashboardUsers implements OnInit {
  // Datos del usuario
  currentUser: any = null;
  today: Date = new Date();
  
  // Datos de citas
  appointments: any[] = [];
  appointmentsLoading: boolean = true;
  appointmentsError: string = '';
  
  // Datos de fórmulas médicas
  formulas: any[] = [];
  formulasLoading: boolean = true;
  formulasError: string = '';
  
  // Datos de incapacidades
  incapacities: any[] = [];
  incapacitiesLoading: boolean = true;
  incapacitiesError: string = '';

  // Datos de dentistas
  dentists: any[] = [];

  formatToDDMMYYYY = formatToDDMMYYYY;
  extractHourFromISO = extractHourFromISO;

  constructor(
    public authServices: AuthServices,
    private incapacidadMedicaService: IncapacidadMedicaServices,
    private appoimentsService: AppoimentsServices,
    private formulaService: FormulaMedicaServices,
    private dentistService: DentistServices
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadDentists();
    this.loadUserData();
  }

  loadCurrentUser() {
    this.currentUser = this.authServices.getCurrentUser();
    console.log('Dashboard - Usuario actual:', this.currentUser);
    console.log('Dashboard - Cédula del usuario:', this.authServices.getCurrentUserCedula());
    console.log('Dashboard - Token:', localStorage.getItem('token'));
  }

  loadDentists() {
    this.dentistService.getDentist().subscribe({
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

  loadUserData() {
    this.loadAppointments();
    this.loadFormulas();
    this.loadIncapacities();
  }

  loadAppointments() {
    console.log('Cargando citas del usuario...');
    const userCedula = this.authServices.getCurrentUserCedula();
    
    if (!userCedula) {
      console.error('No se pudo obtener la cédula del usuario');
      this.appointmentsError = 'No se pudo obtener la información del usuario';
      this.appointmentsLoading = false;
      return;
    }

    // Usar el servicio de citas para obtener todas y filtrar
    this.appoimentsService.getAppoiments().subscribe({
      next: (data: any) => {
        console.log('Todas las citas obtenidas del backend:', data);
        
        if (Array.isArray(data)) {
          // Filtrar citas del usuario actual
          const citasArray = data;
          this.appointments = citasArray.filter((appointment: any) => 
            appointment.cedulaPaciente === userCedula || 
            appointment.documentId === userCedula || 
            appointment.patientCedula === userCedula
          );
          
          // Filtrar solo citas futuras o de hoy
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Inicio del día de hoy
          
          this.appointments = this.appointments.filter((appointment: any) => {
            if (!appointment.date) return false;
            // Extrae solo la parte de la fecha (YYYY-MM-DD)
            const citaFecha = appointment.date.substring(0, 10);
            const hoyFecha = (new Date()).toISOString().substring(0, 10);
            return citaFecha >= hoyFecha;
          });
          
          // Ordenar por fecha (más próximas primero)
          this.appointments.sort((a: any, b: any) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
          
          console.log('Citas filtradas del usuario (solo futuras):', this.appointments);
        } else {
          this.appointments = [];
        }
        
        this.appointmentsLoading = false;
      },
      error: (err) => {
        console.error('Error cargando citas:', err);
        console.error('Detalles del error:', err.error);
        this.appointmentsError = 'Error al cargar las citas: ' + (err.message || 'Error desconocido');
        this.appointmentsLoading = false;
      }
    });
  }

  loadFormulas() {
    console.log('Cargando fórmulas del usuario...');
    const userCedula = this.authServices.getCurrentUserCedula();
    
    if (!userCedula) {
      console.error('No se pudo obtener la cédula del usuario');
      this.formulasError = 'No se pudo obtener la información del usuario';
      this.formulasLoading = false;
      return;
    }

    // Usar el servicio de fórmulas para obtener todas y filtrar
    this.formulaService.getFormulas().subscribe({
      next: (data: any) => {
        console.log('Todas las fórmulas obtenidas del backend:', data);
        
        if (Array.isArray(data)) {
          // Filtrar fórmulas del usuario actual
          const formulasArray = data;
          this.formulas = formulasArray.filter((formula: any) => 
            formula.cedulaPaciente === userCedula || 
            formula.patientCedula === userCedula
          );
          
          // Ordenar por fecha (más recientes primero)
          this.formulas.sort((a: any, b: any) => {
            return new Date(b.fecha || b.date).getTime() - new Date(a.fecha || a.date).getTime();
          });
          
          console.log('Fórmulas filtradas del usuario:', this.formulas);
        } else {
          this.formulas = [];
        }
        
        this.formulasLoading = false;
      },
      error: (err) => {
        console.error('Error cargando fórmulas:', err);
        this.formulasError = 'Error al cargar las fórmulas médicas: ' + (err.message || 'Error desconocido');
        this.formulasLoading = false;
      }
    });
  }

  loadIncapacities() {
    console.log('Cargando incapacidades del usuario...');
    const userCedula = this.authServices.getCurrentUserCedula();
    
    if (!userCedula) {
      console.error('No se pudo obtener la cédula del usuario');
      this.incapacitiesError = 'No se pudo obtener la información del usuario';
      this.incapacitiesLoading = false;
      return;
    }

    this.incapacidadMedicaService.getAllIncapacidadesMedicas().subscribe({
      next: (data: any) => {
        console.log('Todas las incapacidades obtenidas del backend:', data);
        
        // Filtrar incapacidades del usuario actual
        const incapacidadesArray = Array.isArray(data) ? data : [];
        this.incapacities = incapacidadesArray.filter((inc: any) => 
          inc.cedulaPaciente === userCedula || 
          inc.documentId === userCedula ||
          inc.patientCedula === userCedula
        );
        
        // Ordenar por fecha de inicio (más recientes primero)
        this.incapacities.sort((a: any, b: any) => {
          return new Date(b.fechaInicio || b.date).getTime() - new Date(a.fechaInicio || a.date).getTime();
        });
        
        console.log('Incapacidades filtradas del usuario:', this.incapacities);
        this.incapacitiesLoading = false;
      },
      error: (err) => {
        console.error('Error cargando incapacidades:', err);
        this.incapacitiesError = 'Error al cargar las incapacidades: ' + (err.message || 'Error desconocido');
        this.incapacitiesLoading = false;
      }
    });
  }

  getDentistName(appointment: any): string {
    if (appointment.dentistName) return appointment.dentistName;
    if (appointment.dentist && appointment.dentist.name) return appointment.dentist.name;
    if (appointment.doctorName) return appointment.doctorName;
    
    // Buscar en la lista de dentistas por cédula
    const dentistCedula = appointment.cedulaDentista || appointment.dentistId;
    if (dentistCedula && this.dentists.length > 0) {
      const dentist = this.dentists.find(d => d.cedula === dentistCedula);
      if (dentist && dentist.name) return dentist.name;
    }
    
    return 'No especificado';
  }

  // Métodos de utilidad para formateo
  getStatusClass(status: string): string {
    // Si la cita está cancelada, siempre mostrar como cancelada
    if (status?.toLowerCase() === 'cancelada' || status?.toLowerCase() === 'cancelled') {
      return 'cancelada';
    }
    
    // Si la cita está marcada como asistió, siempre mostrar como asistió
    if (status?.toLowerCase() === 'asistio' || status?.toLowerCase() === 'attended') {
      return 'asistio';
    }
    
    // Para citas pendientes, verificar si la fecha ya pasó
    if (status?.toLowerCase() === 'pendiente' || status?.toLowerCase() === 'pending') {
      return 'pendiente';
    }
    
    return 'pendiente';
  }

  getStatusText(status: string, appointmentDate?: string): string {
    // Si la cita está cancelada, siempre mostrar como cancelada
    if (status?.toLowerCase() === 'cancelada' || status?.toLowerCase() === 'cancelled') {
      return 'Cancelada';
    }
    
    // Si la cita está marcada como asistió, siempre mostrar como asistió
    if (status?.toLowerCase() === 'asistio' || status?.toLowerCase() === 'attended') {
      return 'Asistió';
    }
    
    // Para citas pendientes, verificar si la fecha ya pasó
    if (status?.toLowerCase() === 'pendiente' || status?.toLowerCase() === 'pending') {
      if (appointmentDate) {
        const appointmentDateTime = new Date(appointmentDate);
        const now = new Date();
        
        // Si la fecha de la cita ya pasó, mostrar como "Pasada"
        if (appointmentDateTime < now) {
          return 'Pasada';
        }
      }
      return 'Pendiente';
    }
    
    return 'Pendiente';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Fecha no disponible';
    
    // Usar el helper centralizado para formatear la fecha
    return this.formatToDDMMYYYY(dateString);
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha no válida';
    }
  }

  formatTime(appointment: any): string {
    if (!appointment) return 'Hora no disponible';
    
    // Primero intentar usar timeBlock si está disponible
    if (appointment.timeBlock) {
      return appointment.timeBlock;
    }
    
    // Si no hay timeBlock, extraer la hora del string ISO
    if (appointment.date) {
      const hour = this.extractHourFromISO(appointment.date);
      if (hour) return hour;
    }
    
    return 'Hora no disponible';
  }
}
