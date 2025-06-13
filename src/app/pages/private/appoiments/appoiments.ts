import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-appoiments',
  imports: [ReactiveFormsModule],
  templateUrl: './appoiments.html',
  styleUrl: './appoiments.css'
})
export class Appoiments {
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
}
