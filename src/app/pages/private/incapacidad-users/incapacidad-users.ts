import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideBar } from "../../../components/aside-bar-dentist/aside-bar";
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-incapacidad-users',
  imports: [CommonModule, AsideBar, FormsModule],
  templateUrl: './incapacidad-users.html',
  styleUrl: './incapacidad-users.css'
})
export class IncapacidadUsers {
  // Estado del formulario
  successMessage = '';
  errorMessage = '';
  loading = false;

  // Datos del paciente (recibidos por parámetro)
  paciente: any = null;
  pacienteId: string = '';
  pacienteCedula: string = '';

  // Campos del formulario de incapacidad
  fechaInicio = '';
  fechaFin = '';
  diasIncapacidad = '';
  diagnostico = '';
  tipoIncapacidad = '';
  observaciones = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.route.params.subscribe(params => {
      this.pacienteId = params['pacienteId'] || '';
      this.pacienteCedula = params['cedula'] || '';
      if (this.pacienteId || this.pacienteCedula) {
        this.cargarDatosPaciente();
      }
    });
  }

  cargarDatosPaciente() {
    // Aquí podrías cargar los datos del paciente si es necesario
    console.log('Cargando datos del paciente:', this.pacienteId, this.pacienteCedula);
  }

  getHeaders() {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders().set('x-token', token);
  }

  calcularDias() {
    if (this.fechaInicio && this.fechaFin) {
      const inicio = new Date(this.fechaInicio);
      const fin = new Date(this.fechaFin);
      const diffTime = Math.abs(fin.getTime() - inicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir el día inicial
      this.diasIncapacidad = diffDays.toString();
    }
  }

  guardarIncapacidad() {
    this.successMessage = '';
    this.errorMessage = '';
    this.loading = true;

    if (!this.fechaInicio || !this.fechaFin || !this.diagnostico) {
      this.errorMessage = 'Por favor complete todos los campos requeridos.';
      this.loading = false;
      return;
    }

    const incapacidad = {
      pacienteId: this.pacienteId,
      cedulaPaciente: this.pacienteCedula,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      diasIncapacidad: parseInt(this.diasIncapacidad),
      diagnostico: this.diagnostico,
      tipoIncapacidad: this.tipoIncapacidad,
      observaciones: this.observaciones,
      fechaCreacion: new Date().toISOString()
    };

    console.log('Enviando incapacidad:', incapacidad);

    this.http.post('http://localhost:3000/api/incapacidades', incapacidad, { headers: this.getHeaders() })
      .subscribe({
        next: (res: any) => {
          this.successMessage = 'Incapacidad médica guardada correctamente.';
          this.loading = false;
          this.limpiarFormulario();
        },
        error: (err) => {
          this.errorMessage = err?.error?.msg || 'Error al guardar la incapacidad médica.';
          this.loading = false;
        }
      });
  }

  limpiarFormulario() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.diasIncapacidad = '';
    this.diagnostico = '';
    this.tipoIncapacidad = '';
    this.observaciones = '';
  }
} 