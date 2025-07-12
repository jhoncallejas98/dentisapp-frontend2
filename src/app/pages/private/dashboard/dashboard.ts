import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AsideBar } from '../../../components/aside-bar-dentist/aside-bar';
import { FormsModule } from '@angular/forms';
import { AppoimentsServices } from '../../../services/appoiments-services';

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
  imports: [CommonModule, RouterModule, AsideBar, FormsModule],
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

  constructor(private appoimentsService: AppoimentsServices, private router: Router) {}

  ngOnInit() {
    this.cargarPacientesDelDia();
  }

  cargarPacientesDelDia() {
    this.loading = true;
    this.errorMessage = '';
    
    console.log('Obteniendo citas usando el servicio...');
    this.appoimentsService.getAppoiments().subscribe({
      next: (data: any) => {
        // Soporta respuesta como { citas: [...] } o array directo
        const citas = Array.isArray(data) ? data : (data.citas || []);
        
        console.log('Todas las citas recibidas:', citas);
        
        // Filtrar solo las citas del día actual - versión simplificada
        const hoy = new Date();
        const citasDelDia = citas.filter((cita: any) => {
          if (!cita.date) {
            return false;
          }
          
          try {
            const fechaCita = new Date(cita.date);
            if (isNaN(fechaCita.getTime())) {
              return false;
            }
            
            // Mostrar citas de los últimos 7 días en lugar de solo hoy
            const diferenciaDias = Math.floor((hoy.getTime() - fechaCita.getTime()) / (1000 * 60 * 60 * 24));
            return diferenciaDias >= 0 && diferenciaDias <= 7;
          } catch (error) {
            return false;
          }
        });
        
        console.log('Citas filtradas del día:', citasDelDia);
        this.appointments = citasDelDia;
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.msg || 'Error al cargar las citas.';
        this.appointments = [];
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
