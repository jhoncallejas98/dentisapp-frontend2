import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './new-form.html',
  styleUrl: './new-form.css'
})
export class AppoimentsNewForm {
formAppoiments!: FormGroup;

  constructor() {
    this.formAppoiments = new FormGroup({
    cedula: new FormControl(),
    odontologistId: new FormControl(),
    date: new FormControl(),
    startTime: new FormControl(),
    endTime: new FormControl(),
    status: new FormControl(), 
    reason: new FormControl(),
    notes: new FormControl() 
    });
  }

  onSubmit() {
    console.log( this.formAppoiments.value)
  }
}
