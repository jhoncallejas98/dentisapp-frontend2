import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormulaMedicaServices } from '../../../services/formula-medica-services';
import { DentistServices } from '../../../services/dentist-services';
import { AppoimentsServices } from '../../../services/appoiments-services';
import { AuthServices } from '../../../services/auth-services';


@Component({
  selector: 'app-formula-medica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formula-medica.html',
  styleUrl: './formula-medica.css'
})
export class FormulaMedica implements OnInit {
  formFormula!: FormGroup;
  dentist: any[] = [];
  appointments: any[] = [];

  constructor(
    private formulaService: FormulaMedicaServices,
    private dentistService: DentistServices,
    private appoimentService: AppoimentsServices,
    private authServices: AuthServices
  ) {
    this.formFormula = new FormGroup({
      patient: new FormControl('', [Validators.required]),
      dentist: new FormControl('', [Validators.required]),
      appointment: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required]),
      medicamento: new FormControl('', [Validators.required, Validators.minLength(2)]),
      dosis: new FormControl('', [Validators.required]),
      frecuencia: new FormControl('', [Validators.required]),
      duracionDias: new FormControl('', [Validators.required, Validators.min(1)]),
      instrucciones: new FormControl('')
    });
  }

  ngOnInit() {
    this.dentistService.getDentist().subscribe({
      next: (data) => {
        console.log(data);
        this.dentist = Array.isArray(data) ? data : [];
      },
      error: (error) => {
        console.error('Error al cargar odontólogos:', error);
        this.dentist = [];
      },
      complete: () => {
        console.log('Carga de odontólogos completa');
      }
    });

    // Obtener la cédula del doctor actual
    const currentUser = this.authServices.getCurrentUser();
    const doctorCedula = currentUser?.cedula;
    
    if (!doctorCedula) {
      console.error('No se pudo obtener la cédula del doctor actual');
      return;
    }

    this.appoimentService.getAppoiments().subscribe({
      next: (data) => {
        console.log(data);
        const allAppointments = Array.isArray(data) ? data : [];
        
        // Filtrar citas por el doctor actual
        this.appointments = allAppointments.filter((appointment: any) => {
          const appointmentDoctorCedula = appointment.dentist?.cedula || 
                                         appointment.cedulaDentista || 
                                         appointment.dentistId;
          return appointmentDoctorCedula === doctorCedula;
        });
        
        console.log('Citas filtradas por doctor:', this.appointments);
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
        this.appointments = [];
      },
      complete: () => {
        console.log('Carga de citas completa');
      }
    });
  }

  onSubmit() {
    if (this.formFormula.valid) {
      this.formulaService.registerFormula(this.formFormula.value).subscribe({
        next: (res) => {
          console.log('✅ Fórmula registrada:', res);
          this.formFormula.reset();
        },
        error: (error) => {
          console.error('❌ Error al registrar fórmula:', error);
        },
        complete: () => {
          console.log('✅ Registro de fórmula finalizado');
        }
      });
    } else {
      this.formFormula.markAllAsTouched();
    }
  }
}