import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthServices } from '../../services/auth-services';

@Component({
  selector: 'app-aside-users',
  imports: [CommonModule, RouterModule],
  templateUrl: './aside-users.html',
  styleUrl: './aside-users.css'
})
export class AsideUsers implements OnInit {
  currentUser: any = null;
  welcomeMessage: string = '';

  constructor(private authServices: AuthServices) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.currentUser = this.authServices.getCurrentUser();
    this.generateWelcomeMessage();
  }

  generateWelcomeMessage() {
    if (!this.currentUser) {
      this.welcomeMessage = 'Bienvenido';
      return;
    }

    const { name } = this.currentUser;
    let cleanName = name || '';
    
    this.welcomeMessage = cleanName ? `Bienvenido\n${cleanName}` : 'Bienvenido';
  }
}
