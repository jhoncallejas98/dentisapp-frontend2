import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideBar } from "../../../components/aside-bar-dentist/aside-bar";

@Component({
  selector: 'app-odontologodisponible',
  standalone: true,
  imports: [CommonModule, RouterModule, AsideBar],
  templateUrl: './odontologodisponible.html',
  styleUrl: './odontologodisponible.css'
})
export class Odontologodisponible {

}
