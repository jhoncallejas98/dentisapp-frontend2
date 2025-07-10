import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppoimentsServices } from '../../../../services/appoiments-services';
import { DentistServices } from '../../../../services/dentist-services';
import { JsonPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideBar } from "../../../../components/aside-bar-dentist/aside-bar";

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



  constructor( private appoimentsServices: AppoimentsServices, private dentistServices : DentistServices) {
    this.formAppoiments = new FormGroup({
    patient: new FormControl('',[Validators.required]),
    dentist: new FormControl(), // traer los datos del backend ante dde establecdr las reglas
    date: new FormControl( '', [Validators.required]),  // en las fechas son diferentes.  
    timeBlock: new FormControl('', [Validators.required]),
    // endTime: new FormControl('', [Validators.required]),
    status: new FormControl(true, [Validators.required]), 
    reason: new FormControl('',[Validators.required, Validators.minLength(5), Validators.maxLength(50)]  ),
    notes: new FormControl('',[Validators.required, Validators.minLength(5), Validators.maxLength(50)] ) 
    });
  }


  

  onSubmit() {

    console.log(
      this.formAppoiments.valid,
      this.formAppoiments.invalid,
      this.formAppoiments.pristine,
      this.formAppoiments.dirty,
      this.formAppoiments.touched
    )

  if (this.formAppoiments.valid) {
    this.appoimentsServices.registerAppoiment(this.formAppoiments.value).subscribe({
      next: (data) => {
        console.log('✅ Cita registrada:', data);
      },
      error: (error) => {
        console.error( error);
      },
      complete: () => {
        this.formAppoiments.reset();
      }
    });
  }


  }
    ngOnChanges() {
    console.log( 'ngOnChanges' );
  }
  ngOnInit() {
    this.appoimentsServices.getAppoiments().subscribe({
      next: (data) => {
        console.log(data);
        this.appoiments = data
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('complete');
      }
    })

    this.dentistServices.getDentist().subscribe({
      next: (data) => {
        console.log(data);
        this.doctors = data
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('complete');
      }
    })
  }
  ngOnDestroy() {
    console.log( 'ngOnDestroy' );
  }
}

