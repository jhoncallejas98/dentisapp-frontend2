import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppoimentsServices } from '../../../services/appoiments-services';
import { AuthServices } from '../../../services/auth-services';
import { DateUtilsService } from '../../../services/date-utils.service';

interface TodayPatient {
  document: string;
  name: string;
  time: string;
  treatment: string;
  status: string;
  statusText: string;
  _id?: string;
}

interface UpcomingAppointment {
  time: string;
  date: string;
  patientName: string;
  treatment: string;
  duration: number;
  status: string;
  statusText: string;
}

interface Appointment {
  _id: string;
  date: string;
  timeBlock: string;
  reason: string;
  status: string;
  patient: {
    _id: string;
    name: string;
    documentId: string;
    cedula: string;
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  today = new Date();
  appointments: Appointment[] = [];
  loading = false;
  errorMessage = '';

  // Estado para modales y paciente seleccionado
  showViewModal = false;
  showEditModal = false;
  selectedPatient: TodayPatient | null = null;
  // Historia clínica simulada: clave = documento
  clinicalRecords: { [document: string]: { motivo: string; antecedentes: string; diagnostico: string; } } = {
    '1022465873': { motivo: 'Dolor dental', antecedentes: 'Ninguno', diagnostico: 'Caries' },
    '98362792': { motivo: 'Chequeo', antecedentes: 'Alergia a penicilina', diagnostico: 'Sano' }
    // El tercero no tiene historia clínica
  };
  // Campos para formulario de historia clínica
  motivo = '';
  antecedentes = '';
  diagnostico = '';

  upcomingAppointments: UpcomingAppointment[] = [
    {
      time: '09:00',
      date: 'Mañana',
      patientName: 'Carlos Rodríguez',
      treatment: 'Consulta general',
      duration: 30,
      status: 'confirmed',
      statusText: 'Confirmada'
    },
    {
      time: '11:30',
      date: 'Mañana',
      patientName: 'Ana Martínez',
      treatment: 'Limpieza dental',
      duration: 45,
      status: 'pending',
      statusText: 'Pendiente'
    },
    {
      time: '15:00',
      date: 'Tarde',
      patientName: 'Roberto Silva',
      treatment: 'Extracción',
      duration: 60,
      status: 'confirmed',
      statusText: 'Confirmada'
    }
  ];

  constructor(
    private appoimentsService: AppoimentsServices, 
    private router: Router, 
    private authServices: AuthServices,
    private dateUtilsService: DateUtilsService
  ) {}

  ngOnInit() {
    this.cargarPacientesDelDia();
  }

  // Función helper para traducir estados de citas
  translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'attended': 'Atendido',
      'completed': 'Completado',
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'cancelled': 'Cancelada',
      'asistio': 'Asistió',
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'cancelada': 'Cancelada'
    };
    return statusMap[status?.toLowerCase()] || status;
  }

  cargarPacientesDelDia() {
    this.loading = true;
    this.errorMessage = '';

    // Obtener la cédula del doctor actual
    const currentUser = this.authServices.getCurrentUser();
    const doctorCedula = currentUser?.cedula;
    
    if (!doctorCedula) {
      console.error('No se pudo obtener la cédula del doctor actual');
      this.errorMessage = 'Error al obtener información del usuario';
      this.loading = false;
      return;
    }

    this.appoimentsService.getAppoiments().subscribe({
      next: (data: any) => {
        console.log('Todas las citas obtenidas:', data);
        
        // Procesar las citas
        let allAppointments = [];
        if (Array.isArray(data)) {
          allAppointments = data;
        } else if (data && Array.isArray(data.citas)) {
          allAppointments = data.citas;
        } else {
          allAppointments = [];
        }

        // Filtrar citas por el doctor actual
        const doctorAppointments = allAppointments.filter((appointment: any) => {
          const appointmentDoctorCedula = appointment.dentist?.cedula || 
                                         appointment.cedulaDentista || 
                                         appointment.dentistId;
          return appointmentDoctorCedula === doctorCedula;
        });

        console.log('Citas filtradas por doctor:', doctorAppointments);

        // Filtrar citas del día actual
        const todayString = this.dateUtilsService.getTodayString();
        
        this.appointments = doctorAppointments.filter((appointment: any) => {
          // Usar el servicio para manejar fechas de manera consistente
          const appointmentDateString = this.dateUtilsService.formatDate(appointment.date);
          console.log('Comparando fechas - Hoy:', todayString, 'Cita:', appointmentDateString);
          return this.dateUtilsService.areDatesEqual(appointmentDateString, todayString);
        });

        console.log('Pacientes del día para el doctor:', this.appointments);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando citas:', err);
        this.errorMessage = 'Error al cargar las citas del día';
        this.loading = false;
      }
    });
  }

  atenderPaciente(appointment: any) {
    // Cambiar el estado de la cita a "attended" o "completed"
    const newStatus = 'attended'; // o 'completed' según prefieras
    
    console.log('Cambiando estado de cita:', appointment._id, 'a:', newStatus);
    
    this.appoimentsService.updateAppoiment(appointment._id, { status: newStatus }).subscribe({
      next: (response) => {
        console.log('Estado actualizado exitosamente:', response);
        
        // Actualizar el estado en la lista local
        const citaIndex = this.appointments.findIndex(c => c._id === appointment._id);
        if (citaIndex !== -1) {
          this.appointments[citaIndex].status = newStatus;
        }
        
        // Redirigir a la historia clínica del paciente
        const doc = appointment?.patient?.cedula || appointment?.patient?.documentId || appointment?.patient?._id;
        if (doc) {
          this.router.navigate(['/historia-clinica', doc]);
        }
      },
      error: (err) => {
        console.error('Error actualizando estado de cita:', err);
        // Aún así, redirigir a la historia clínica
        const doc = appointment?.patient?.cedula || appointment?.patient?.documentId || appointment?.patient?._id;
        if (doc) {
          this.router.navigate(['/historia-clinica', doc]);
        }
      }
    });
  }

  // Métodos para las estadísticas
  getTotalPatients(): number {
    return 156; // Simulado
  }

  getTodayAppointments(): number {
    return this.appointments.length;
  }

  getCompletedAppointments(): number {
    return this.appointments.filter(p => p.status === 'completed').length;
  }

  getPendingAppointments(): number {
    return this.appointments.filter(p => p.status === 'pending').length;
  }

  get selectedClinicalRecord() {
    if (this.selectedPatient && this.selectedPatient.document) {
      return this.clinicalRecords[this.selectedPatient.document];
    }
    return null;
  }

  getPatientInitial(patient: any): string {
    const name = patient?.name || patient;
    if (typeof name === 'string' && name.length > 0) {
      return name.charAt(0).toUpperCase();
    }
    return 'P';
  }

  // Abrir modal de ver historia clínica
  openViewModal(patient: TodayPatient) {
    this.selectedPatient = patient;
    this.showViewModal = true;
  }
  // Abrir modal de atender (crear/editar historia clínica)
  openEditModal(patient: TodayPatient) {
    this.selectedPatient = patient;
    const record = this.clinicalRecords[patient.document];
    this.motivo = record ? record.motivo : '';
    this.antecedentes = record ? record.antecedentes : '';
    this.diagnostico = record ? record.diagnostico : '';
    this.showEditModal = true;
  }
  // Cerrar modales
  closeModals() {
    this.showViewModal = false;
    this.showEditModal = false;
    this.selectedPatient = null;
  }
  // Guardar historia clínica (crear o actualizar)
  saveClinicalRecord() {
    if (this.selectedPatient) {
      this.clinicalRecords[this.selectedPatient.document] = {
        motivo: this.motivo,
        antecedentes: this.antecedentes,
        diagnostico: this.diagnostico
      };
    }
    this.closeModals();
  }
}
