import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-authorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-authorized-container">
      <h2>Acceso no autorizado</h2>
      <p>No tienes permisos para ver esta página.</p>
      <button routerLink="/home" class="btn-primary">Ir al inicio</button>
    </div>
  `,
  styles: [`
    .not-authorized-container {
      max-width: 400px;
      margin: 80px auto;
      padding: 2rem;
      background: #fff3f3;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
      text-align: center;
    }
    .not-authorized-container h2 {
      color: #c0392b;
      margin-bottom: 1rem;
    }
    .not-authorized-container p {
      color: #555;
      margin-bottom: 2rem;
    }
    .btn-primary {
      background: #c0392b;
      color: #fff;
      border: none;
      padding: 0.7rem 1.5rem;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-primary:hover {
      background: #a93226;
    }
  `]
})
export class NotAuthorized {} 