import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppoimentsServices } from '../../../../services/appoiments-services';
import { DentistServices } from '../../../../services/dentist-services';
import { JsonPipe, CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AsideBar } from "../../../../components/aside-bar-dentist/aside-bar";
import { AvailabilityServices } from '../../../../services/availability-services';
import { DateUtilsService } from '../../../../services/date-utils.service';

@Component({
  selector: 'app-new-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsideBar, CommonModule, RouterModule],
  templateUrl: './new-form.html',
  styleUrl: './new-form.css'
})
export class AppoimentsNewForm {
formAppoiments!: FormGroup;
appoiments: any =[];
doctors: any = [];
appointmentId: string | null = null;
submitting = false;
successMessage = '';
errorMessage = '';
availableBlocks: string[] = [];

  // Helper method para manejar fechas de manera consistente
  private formatDate(dateString: string): string {
    if (!dateString) return '';
    
    // Si ya está en formato YYYY-MM-DD, devolverlo directamente
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    
    // Si no, convertirla de manera segura
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return dateString;
    }
  }


  constructor(
    private appoimentsServices: AppoimentsServices,
    private dentistServices: DentistServices,
    private availabilityServices: AvailabilityServices,
    private dateUtilsService: DateUtilsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.formAppoiments = new FormGroup({
      patient: new FormControl('', [Validators.required]),
      dentist: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      timeBlock: new FormControl('', [Validators.required]),
      status: new FormControl('pendiente', [Validators.required]),
      reason: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      notes: new FormControl('', [Validators.maxLength(200)])
    });
  }


  

  onSubmit() {
    console.log('=== onSubmit ejecutado ===');
    console.log('Formulario válido:', this.formAppoiments.valid);
    console.log('Formulario inválido:', this.formAppoiments.invalid);
    console.log('Valores del formulario:', this.formAppoiments.value);
    console.log('Errores del formulario:', this.formAppoiments.errors);
    
    this.successMessage = '';
    this.errorMessage = '';

    console.log(
      this.formAppoiments.valid,
      this.formAppoiments.invalid,
      this.formAppoiments.pristine,
      this.formAppoiments.dirty,
      this.formAppoiments.touched
    )

  if (this.formAppoiments.valid) {
    console.log('Formulario es válido, procediendo a enviar...');
    this.submitting = true;
    // Preparar el objeto a enviar
    const raw = this.formAppoiments.value;
    console.log('Datos raw del formulario:', raw);
    
    // Manejar la fecha correctamente para evitar problemas de zona horaria
    let fechaProcesada = raw.date;
    if (raw.date) {
      // Usar el helper method para formatear la fecha correctamente
      fechaProcesada = this.dateUtilsService.formatDate(raw.date);
      console.log('Fecha original:', raw.date);
      console.log('Fecha procesada:', fechaProcesada);
    }
    
    const cita: any = {
      date: fechaProcesada,
      timeBlock: raw.timeBlock,
      status: raw.status,
      reason: raw.reason,
      notes: raw.notes
    };
    // Paciente: si es ObjectId (24 hex), enviar patient, si no, cedulaPaciente
    if (/^[a-f\d]{24}$/i.test(raw.patient)) {
      cita.patient = raw.patient;
    } else {
      cita.cedulaPaciente = raw.patient;
    }
    // Odontólogo: si es ObjectId (24 hex), enviar dentist, si no, cedulaDentista
    if (/^[a-f\d]{24}$/i.test(raw.dentist)) {
      cita.dentist = raw.dentist;
    } else {
      cita.cedulaDentista = raw.dentist;
    }
    
    console.log('Cita preparada para enviar:', cita);
    
    if (this.appointmentId) {
      console.log('Actualizando cita existente...');
      this.appoimentsServices.updateAppoiment(this.appointmentId, cita).subscribe({
        next: (response) => {
          console.log('Cita actualizada:', response);
          this.successMessage = 'Cita actualizada correctamente.';
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error actualizando cita:', error);
          this.errorMessage = error?.error?.msg || error.message || 'Error actualizando cita.';
          this.submitting = false;
        }
      });
    } else {
      console.log('Creando nueva cita...');
      this.appoimentsServices.registerAppoiment(cita).subscribe({
        next: (response) => {
          console.log('Cita creada:', response);
          this.successMessage = 'Cita agendada correctamente.';
          this.formAppoiments.reset({ status: 'pendiente' });
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error creando cita:', error);
          this.errorMessage = error?.error?.msg || error.message || 'Error agendando cita.';
          this.submitting = false;
        }
      });
    }
  } else {
    console.log('Formulario NO es válido, no se envía');
    console.log('Errores por campo:');
    Object.keys(this.formAppoiments.controls).forEach(key => {
      const control = this.formAppoiments.get(key);
      if (control?.errors) {
        console.log(`${key}:`, control.errors);
      }
    });
  }
  }
    ngOnChanges() {
    console.log( 'ngOnChanges' );
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.appointmentId = params.get('id');
      if (this.appointmentId) {
        this.appoimentsServices.getAppoimentById(this.appointmentId).subscribe({
          next: (data: any) => {
            this.formAppoiments.patchValue({
              patient: data.patient?._id || data.patient,
              dentist: data.dentist?._id || data.dentist,
              date: data.date?.substring(0, 10),
              timeBlock: data.timeBlock,
              status: data.status,
              reason: data.reason,
              notes: data.notes
            });
          },
          error: (err) => {
            console.error('Error cargando cita', err);
          }
        });
      }
    });

    this.dentistServices.getDentist().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.formAppoiments.get('dentist')?.valueChanges.subscribe(() => {
      this.updateAvailableBlocks();
    });
    this.formAppoiments.get('date')?.valueChanges.subscribe(() => {
      this.updateAvailableBlocks();
    });
  }

  updateAvailableBlocks() {
    const dentistId = this.formAppoiments.get('dentist')?.value;
    const date = this.formAppoiments.get('date')?.value;
    
    console.log('Consultando disponibilidad:', { dentistId, date });
    
    if (!dentistId || !date) {
      this.availableBlocks = [];
      this.formAppoiments.get('timeBlock')?.disable();
      return;
    }
    
    this.availabilityServices.getAvailability(dentistId, date).subscribe({
      next: (availability: any) => {
        console.log('Respuesta del backend:', availability);
        
        // Procesar la respuesta: puede ser array o objeto directo
        let disponibilidadData;
        if (Array.isArray(availability) && availability.length > 0) {
          disponibilidadData = availability[0]; // Tomar el primer elemento del array
        } else if (availability && typeof availability === 'object') {
          disponibilidadData = availability; // Usar el objeto directo
        } else {
          disponibilidadData = {};
        }
        
        const bloquesDisponibles = disponibilidadData?.bloquesDisponibles || [];
        console.log('Bloques disponibles extraídos:', bloquesDisponibles);
        
        // Ahora obtener las citas ya agendadas para ese dentista y fecha
        this.appoimentsServices.getAppoiments().subscribe({
          next: (allAppoiments: any) => {
            const citas = Array.isArray(allAppoiments) ? allAppoiments : (allAppoiments.citas || []);
            const ocupados = citas
              .filter((c: any) => c.dentist === dentistId && c.date?.slice(0, 10) === date)
              .map((c: any) => c.timeBlock);
            this.availableBlocks = bloquesDisponibles.filter((block: string) => !ocupados.includes(block));
            console.log('Bloques disponibles finales:', this.availableBlocks);
            
            // Habilitar/deshabilitar el control según los bloques disponibles
            if (this.availableBlocks.length > 0) {
              this.formAppoiments.get('timeBlock')?.enable();
            } else {
              this.formAppoiments.get('timeBlock')?.disable();
            }
          },
          error: () => {
            this.availableBlocks = bloquesDisponibles;
            if (this.availableBlocks.length > 0) {
              this.formAppoiments.get('timeBlock')?.enable();
            } else {
              this.formAppoiments.get('timeBlock')?.disable();
            }
          }
        });
      },
      error: (err) => {
        console.log('Error consultando disponibilidad:', err);
        this.availableBlocks = [];
        this.formAppoiments.get('timeBlock')?.disable();
      }
    });
  }
  ngOnDestroy() {
    console.log( 'ngOnDestroy' );
  }
}

