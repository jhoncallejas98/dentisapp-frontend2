import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServices } from '../../services/auth-services';

@Component({
  selector: 'app-aside-bar',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './aside-bar.html',
  styleUrl: './aside-bar.css'
})
export class AsideBar implements OnInit {
  currentUser: any = null;
  welcomeMessage: string = '';
  userRole: string = '';

  constructor(private authServices: AuthServices) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    // Obtener el usuario del localStorage o del servicio de autenticación
    const userStr = localStorage.getItem('user');
    console.log('Usuario en localStorage:', userStr);
    
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      this.userRole = this.currentUser.role || '';
      console.log('Usuario parseado:', this.currentUser);
      console.log('Rol del usuario:', this.userRole);
      this.generateWelcomeMessage();
    } else {
      console.log('No hay usuario en localStorage');
      this.welcomeMessage = 'Bienvenido,';
    }
  }

  generateWelcomeMessage() {
    console.log('Generando mensaje de bienvenida para:', this.currentUser);
    
    if (!this.currentUser) {
      this.welcomeMessage = 'Bienvenido,';
      return;
    }

    const { role, name } = this.currentUser;
    let cleanName = name || '';
    
    console.log('Rol:', role, 'Nombre:', cleanName);

    // Saludo simple para todos los usuarios
    this.welcomeMessage = cleanName ? `Bienvenido\n${cleanName}` : 'Bienvenido,';
    
    console.log('Mensaje generado:', this.welcomeMessage);
  }

  showComingSoon() {
    alert("✨ Próximamente disponible");
  }

  // Métodos para verificar el rol del usuario
  isDentist(): boolean {
    return this.userRole === 'dentist' || this.userRole === 'admin';
  }

  isPatient(): boolean {
    return this.userRole === 'patient';
  }
}
