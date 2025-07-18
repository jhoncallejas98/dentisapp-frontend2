import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';


@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
export class PublicLayout {}