import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthServices } from '../../../services/auth-services';
import { HistoriaClinicaServices } from '../../../services/historia-clinica-services';
import { IncapacidadMedicaServices } from '../../../services/incapacidad-medica-services';
import { FormulaMedicaServices } from '../../../services/formula-medica-services';
import { AppoimentsServices } from '../../../services/appoiments-services';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historia-clinica.html',
  styleUrl: './historia-clinica.css'
})
export class HistoriaClinica {
  // Estado de búsqueda
  cedulaBusqueda = '';
  paciente: any = null;
  pacienteError = '';
  buscandoPaciente = false;
  formularioHabilitado = false;
  successMessage = '';
  errorMessage = '';
  historiaId: string | null = null;

  // Campos del formulario
  documentId = '';
  birthDate = '';
  age = '';
  email = '';
  gender = '';
  ethnicGroup = '';
  bloodType = '';
  covidIsolation = '';
  consultReason = '';
  diseaseHistory = '';
  personalHistory = '';
  familyHistory = '';
  currentMeds = '';
  oralHygiene = '';
  intraoralExam = '';
  otherFindings = '';
  companionName = '';
  companionId = '';
  companionRelation = '';
  isGuardian = '';
  guardianName = '';
  guardianId = '';
  guardianPhone = '';

  editMode = false;

  // Variable para el sistema de pestañas
  activeTab = 'historia';

  // Variables para incapacidades
  incapacidades: any[] = [];
  showIncapacidadForm = false;
  incapacidadForm = {
    fechaInicio: '',
    fechaFin: '',
    diasIncapacidad: '',
    diagnostico: '',
    motivo: '',
    tratamiento: '',
    tipoIncapacidad: '',
    observaciones: ''
  };

  // Variables para fórmulas médicas
  formulas: any[] = [];
  showFormulaForm = false;
  formulaForm = {
    medicamento: '',
    dosis: '',
    frecuencia: '',
    duracionDias: '',
    instrucciones: ''
  };

  appointments: any[] = [];
  selectedAppointmentId: string = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private http: HttpClient, 
    private authServices: AuthServices,
    private historiaClinicaService: HistoriaClinicaServices,
    private incapacidadMedicaService: IncapacidadMedicaServices,
    private formulaService: FormulaMedicaServices,
    private appoimentsService: AppoimentsServices
  ) {
    this.route.params.subscribe(params => {
      const documento = params['documento'];
      if (documento) {
        // Si viene del dashboard, buscar directamente sin mostrar búsqueda
        this.buscarPacientePorDocumento(documento);
      }
    });
  }

  buscarPacientePorDocumento(documento: string) {
    console.log('Buscando paciente con documento:', documento);
    this.paciente = null;
    this.pacienteError = '';
    this.formularioHabilitado = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.buscandoPaciente = true;
    
    // Usar getAllUsers y filtrar por cédula
    this.authServices.getAllUsers().subscribe({
      next: (users: any) => {
        console.log('Todos los usuarios:', users);
        const usuarios = Array.isArray(users) ? users : [];
        const paciente = usuarios.find((user: any) => 
          user.cedula === documento || user.documentId === documento || user._id === documento
        );
        
        if (paciente) {
          console.log('Paciente encontrado:', paciente);
          this.paciente = paciente;
          this.pacienteError = '';
          this.formularioHabilitado = true;
          this.documentId = paciente.cedula || paciente.documentId;
          this.email = paciente.email;
          this.buscandoPaciente = false;
          console.log('Formulario habilitado, buscando historia clínica...');
          // Buscar historia clínica existente
          this.cargarHistoriaClinica(paciente.cedula || paciente.documentId);
          // Cargar incapacidades y fórmulas médicas
          this.cargarIncapacidades(paciente.cedula || paciente.documentId);
          this.cargarFormulas(paciente.cedula || paciente.documentId);
          this.cargarCitasDelPaciente(paciente.cedula || paciente.documentId);
        } else {
          console.log('Paciente no encontrado');
          this.paciente = null;
          this.pacienteError = 'Paciente no encontrado.';
          this.formularioHabilitado = false;
          this.buscandoPaciente = false;
        }
      },
      error: (err) => {
        console.log('Error obteniendo usuarios:', err);
        this.paciente = null;
        this.pacienteError = 'Error al obtener la lista de usuarios.';
        this.formularioHabilitado = false;
        this.buscandoPaciente = false;
      }
    });
  }

  cargarHistoriaClinica(cedula: string) {
    console.log('Buscando historia clínica para cédula:', cedula);
    this.historiaClinicaService.getHistoriaClinicaByCedula(cedula).subscribe({
      next: (historias: any) => {
        console.log('Todas las historias clínicas:', historias);
        // Filtrar por cédula del paciente
        const historiasArray = Array.isArray(historias) ? historias : [];
        const historia = historiasArray.find((h: any) => 
          h.cedulaPaciente === cedula || h.documentId === cedula
        );
        
        if (historia && historia._id) {
          console.log('Historia clínica encontrada:', historia._id);
          this.historiaId = historia._id;
          // Convertir fecha ISO a formato yyyy-MM-dd para el input date
          this.birthDate = historia.birthDate ? this.formatDateForInput(historia.birthDate) : '';
          this.age = historia.age || '';
          this.email = historia.email || '';
          this.gender = historia.gender || '';
          this.ethnicGroup = historia.ethnicGroup || '';
          this.bloodType = historia.bloodType || '';
          this.covidIsolation = historia.covidIsolation || '';
          this.consultReason = historia.consultReason || '';
          this.diseaseHistory = historia.diseaseHistory || '';
          this.personalHistory = historia.personalHistory || '';
          this.familyHistory = historia.familyHistory || '';
          this.currentMeds = historia.currentMeds || '';
          this.oralHygiene = historia.oralHygiene || '';
          this.intraoralExam = historia.intraoralExam || '';
          this.otherFindings = historia.otherFindings || '';
          this.companionName = historia.companionName || '';
          this.companionId = historia.companionId || '';
          this.companionRelation = historia.companionRelation || '';
          this.isGuardian = historia.isGuardian || '';
          this.guardianName = historia.guardianName || '';
          this.guardianId = historia.guardianId || '';
          this.guardianPhone = historia.guardianPhone || '';
          this.editMode = false;
          console.log('Modo vista activado, historiaId:', this.historiaId);
        } else {
          console.log('No se encontró historia clínica, modo edición activado');
          this.historiaId = null;
          this.editMode = true;
          this.formularioHabilitado = true; // Asegurar que esté habilitado
        }
      },
      error: (err) => {
        console.log('Error buscando historia clínica:', err);
        this.historiaId = null;
        this.editMode = true;
        this.formularioHabilitado = true; // Asegurar que esté habilitado
      }
    });
  }

  cargarIncapacidades(cedula: string) {
    console.log('Cargando incapacidades para cédula:', cedula);
    this.incapacidadMedicaService.getAllIncapacidadesMedicas().subscribe({
      next: (incapacidades: any) => {
        console.log('Todas las incapacidades:', incapacidades);
        // Filtrar por cédula del paciente
        const incapacidadesArray = Array.isArray(incapacidades) ? incapacidades : [];
        this.incapacidades = incapacidadesArray.filter((inc: any) => 
          inc.cedulaPaciente === cedula || inc.documentId === cedula
        );
        console.log('Incapacidades filtradas:', this.incapacidades);
      },
      error: (err) => {
        console.error('Error cargando incapacidades:', err);
        this.incapacidades = [];
      }
    });
  }

  cargarFormulas(cedula: string) {
    console.log('Cargando fórmulas médicas para cédula:', cedula);
    // Aquí necesitarías un método en el servicio de fórmulas para buscar por cédula
    // Por ahora usamos getAll y filtramos
    this.formulaService.getFormulas().subscribe({
      next: (formulas: any) => {
        console.log('Todas las fórmulas:', formulas);
        const formulasArray = Array.isArray(formulas) ? formulas : [];
        // Filtrar por cédula del paciente (asumiendo que hay un campo cedulaPaciente)
        this.formulas = formulasArray.filter((f: any) => 
          f.cedulaPaciente === cedula || f.patientCedula === cedula
        );
      },
      error: (err) => {
        console.log('Error cargando fórmulas:', err);
        this.formulas = [];
      }
    });
  }

  cargarCitasDelPaciente(cedula: string) {
    this.appoimentsService.getAppoimentsByCedula(cedula).subscribe(
      (citas: any) => {
        console.log('Todas las citas obtenidas:', citas);
        // Filtrar citas por cédula del paciente
        const citasArray = Array.isArray(citas) ? citas : [];
        this.appointments = citasArray.filter((cita: any) => 
          cita.cedulaPaciente === cedula || cita.documentId === cedula || cita.patientCedula === cedula
        );
        console.log('Citas filtradas del paciente:', this.appointments);
      },
      (err: any) => {
        console.error('Error cargando citas:', err);
        this.appointments = [];
      }
    );
  }

  setEditMode() {
    this.editMode = true;
  }
  setViewMode() {
    this.editMode = false;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Método para convertir fecha ISO a formato yyyy-MM-dd
  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  }

  saveClinicalData() {
    this.successMessage = '';
    this.errorMessage = '';
    if (!this.formularioHabilitado || !this.paciente) return;

    // Validación de campos obligatorios
    if (!this.documentId || !this.birthDate || !this.age || !this.email || !this.gender || !this.ethnicGroup || !this.bloodType ||
        (this.covidIsolation !== 'true' && this.covidIsolation !== 'false') ||
        !this.consultReason || !this.diseaseHistory || !this.personalHistory || !this.familyHistory || !this.currentMeds ||
        !this.oralHygiene || !this.intraoralExam || !this.otherFindings || !this.companionName || !this.companionId || !this.companionRelation ||
        (this.isGuardian !== 'true' && this.isGuardian !== 'false') ||
        !this.guardianName || !this.guardianId || !this.guardianPhone) {
      this.errorMessage = 'Por favor completa todos los campos obligatorios antes de guardar la historia clínica.';
      return;
    }

    // Normalizar booleanos
    const covidIsolationValue = this.covidIsolation === 'true' ? true : this.covidIsolation === 'false' ? false : this.covidIsolation;
    const isGuardianValue = this.isGuardian === 'true' ? true : this.isGuardian === 'false' ? false : this.isGuardian;

    console.log('Guardando historia clínica...');
    console.log('Paciente:', this.paciente);
    console.log('historiaId:', this.historiaId);

    // Construir el objeto de historia clínica
    const historia = {
      patient: this.paciente._id,
      cedulaPaciente: this.paciente.cedula,
      documentId: this.documentId,
      birthDate: this.birthDate,
      age: this.age,
      email: this.email,
      gender: this.gender,
      ethnicGroup: this.ethnicGroup,
      bloodType: this.bloodType,
      covidIsolation: covidIsolationValue,
      consultReason: this.consultReason,
      diseaseHistory: this.diseaseHistory,
      personalHistory: this.personalHistory,
      familyHistory: this.familyHistory,
      currentMeds: this.currentMeds,
      oralHygiene: this.oralHygiene,
      intraoralExam: this.intraoralExam,
      otherFindings: this.otherFindings,
      companionName: this.companionName,
      companionId: this.companionId,
      companionRelation: this.companionRelation,
      isGuardian: isGuardianValue,
      guardianName: this.guardianName,
      guardianId: this.guardianId,
      guardianPhone: this.guardianPhone
    };

    console.log('Objeto historia a enviar:', historia);
    if (this.historiaId) {
      // Actualizar historia clínica existente
      this.historiaClinicaService.updateHistoriaClinica(this.historiaId, historia).subscribe({
        next: (res: any) => {
          this.successMessage = 'Historia clínica actualizada correctamente.';
          this.editMode = false;
        },
        error: (err) => {
          this.errorMessage = err?.error?.msg || 'Error al actualizar la historia clínica.';
        }
      });
    } else {
      // Crear nueva historia clínica
      this.historiaClinicaService.createHistoriaClinica(historia).subscribe({
        next: (res: any) => {
          this.successMessage = 'Historia clínica guardada correctamente.';
          this.historiaId = res._id || res.id; // Guardar el ID de la historia creada
          this.editMode = false;
        },
        error: (err) => {
          this.errorMessage = err?.error?.msg || 'Error al guardar la historia clínica.';
        }
      });
    }
  }

  // Métodos para incapacidades
  toggleIncapacidadForm() {
    this.showIncapacidadForm = !this.showIncapacidadForm;
    this.showFormulaForm = false; // Cerrar el otro formulario
  }

  calcularDiasIncapacidad() {
    if (this.incapacidadForm.fechaInicio && this.incapacidadForm.fechaFin) {
      const inicio = new Date(this.incapacidadForm.fechaInicio);
      const fin = new Date(this.incapacidadForm.fechaFin);
      const diffTime = Math.abs(fin.getTime() - inicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      this.incapacidadForm.diasIncapacidad = diffDays.toString();
    }
  }

  guardarIncapacidad() {
    if (!this.incapacidadForm.fechaInicio || !this.incapacidadForm.fechaFin || 
        !this.incapacidadForm.diagnostico || !this.incapacidadForm.motivo || 
        !this.incapacidadForm.tratamiento) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const incapacidadData = {
      patient: this.paciente._id, // Agregar ID del paciente
      cedulaPaciente: this.documentId,
      fechaInicio: this.incapacidadForm.fechaInicio,
      fechaFin: this.incapacidadForm.fechaFin,
      diasIncapacidad: parseInt(this.incapacidadForm.diasIncapacidad) || 0, // Convertir a número
      diagnostico: this.incapacidadForm.diagnostico,
      motivo: this.incapacidadForm.motivo,
      tratamiento: this.incapacidadForm.tratamiento,
      tipoIncapacidad: this.incapacidadForm.tipoIncapacidad || 'Enfermedad General',
      observaciones: this.incapacidadForm.observaciones || ''
    };

    console.log('Guardando incapacidad:', incapacidadData);
    console.log('Paciente:', this.paciente);

    this.incapacidadMedicaService.createIncapacidadMedica(incapacidadData).subscribe({
      next: (response) => {
        console.log('Incapacidad guardada exitosamente:', response);
        this.successMessage = 'Incapacidad médica guardada exitosamente';
        this.limpiarFormularioIncapacidad();
        this.showIncapacidadForm = false;
        // Recargar incapacidades
        this.cargarIncapacidades(this.documentId);
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error guardando incapacidad:', err);
        console.error('Detalles del error:', err.error);
        console.error('Status:', err.status);
        console.error('StatusText:', err.statusText);
        this.errorMessage = `Error al guardar la incapacidad médica: ${err.error?.msg || err.message || 'Error desconocido'}`;
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  limpiarFormularioIncapacidad() {
    this.incapacidadForm = {
      fechaInicio: '',
      fechaFin: '',
      diasIncapacidad: '',
      diagnostico: '',
      motivo: '',
      tratamiento: '',
      tipoIncapacidad: '',
      observaciones: ''
    };
  }

  // Métodos para fórmulas médicas
  toggleFormulaForm() {
    this.showFormulaForm = !this.showFormulaForm;
    this.showIncapacidadForm = false; // Cerrar el otro formulario
  }

  guardarFormula() {
    if (!this.formulaForm.medicamento || !this.formulaForm.dosis || !this.formulaForm.frecuencia || !this.formulaForm.duracionDias) {
      this.errorMessage = 'Por favor complete todos los campos requeridos.';
      setTimeout(() => { this.errorMessage = ''; }, 8000);
      return;
    }

    const dentistId = this.authServices.getCurrentUserId();
    const cedulaDentista = this.authServices.getCurrentUserCedula();

    if (!dentistId || !cedulaDentista) {
      this.errorMessage = 'No se pudo obtener la información del dentista.';
      setTimeout(() => { this.errorMessage = ''; }, 8000);
      return;
    }

    const formula = {
      patient: this.paciente._id,
      cedulaPaciente: this.paciente.cedula,
      dentist: dentistId,
      cedulaDentista: cedulaDentista,
      fecha: new Date(),
      medicamento: this.formulaForm.medicamento,
      dosis: this.formulaForm.dosis,
      frecuencia: this.formulaForm.frecuencia,
      duracionDias: Number(this.formulaForm.duracionDias),
      instrucciones: this.formulaForm.instrucciones
    };

    this.formulaService.registerFormula(formula).subscribe({
      next: (res: any) => {
        this.successMessage = 'Fórmula médica guardada correctamente.';
        setTimeout(() => { this.successMessage = ''; }, 8000);
        this.showFormulaForm = false;
        this.limpiarFormularioFormula();
        this.cargarFormulas(this.paciente.cedula);
      },
      error: (err) => {
        this.errorMessage = err?.error?.msg || 'Error al guardar la fórmula médica.';
        setTimeout(() => { this.errorMessage = ''; }, 8000);
      }
    });
  }

  limpiarFormularioFormula() {
    this.formulaForm = {
      medicamento: '',
      dosis: '',
      frecuencia: '',
      duracionDias: '',
      instrucciones: ''
    };
  }

  irAIncapacidad() {
    if (this.paciente && this.paciente.cedula) {
      this.router.navigate(['/incapacidad', this.paciente.cedula]);
    }
  }
}
