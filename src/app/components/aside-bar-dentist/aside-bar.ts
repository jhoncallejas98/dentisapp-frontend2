import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthServices } from '../../services/auth-services';

@Component({
  selector: 'app-aside-bar',
  imports: [RouterModule, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './aside-bar.html',
  styleUrls: ['./aside-bar.css']
})
export class AsideBar implements OnInit {
  @Input() menuOpen: boolean = false;
  @Output() closeMenu = new EventEmitter<void>();

  currentUser: any = null;
  welcomeMessage: string = '';
  userRole: string = '';
  searchTerm: string = '';
  searchResults: any[] = [];

  constructor(private authServices: AuthServices, private router: Router) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      this.userRole = this.currentUser.role || '';
      this.generateWelcomeMessage();
    } else {
      this.welcomeMessage = 'Bienvenido,';
    }
  }

  generateWelcomeMessage() {
    if (!this.currentUser) {
      this.welcomeMessage = 'Bienvenido,';
      return;
    }
    const { role, name } = this.currentUser;
    let cleanName = name || '';
    this.welcomeMessage = cleanName ? `Bienvenido\n${cleanName}` : 'Bienvenido,';
  }

  showComingSoon() {
    alert("✨ Próximamente disponible");
  }

  isDentist(): boolean {
    return this.userRole === 'dentist' || this.userRole === 'admin';
  }

  isPatient(): boolean {
    return this.userRole === 'patient';
  }

  isMobile(): boolean {
    return window.innerWidth <= 900;
  }

  openMenu() {
    // No-op, controlado por input
  }
  closeMenuDrawer() {
    this.closeMenu.emit();
    this.searchResults = [];
    this.searchTerm = '';
  }
  toggleMenu() {
    if (this.menuOpen) {
      this.closeMenuDrawer();
    } else {
      // No-op, controlado por input
    }
  }

  onSearchInput() {
    if (!this.isDentist()) return;
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      return;
    }
    this.authServices.getAllUsers().subscribe({
      next: (users: any) => {
        const patients = Array.isArray(users) ? users.filter(u => u.role === 'patient') : [];
        this.searchResults = patients.filter(patient => 
          patient.cedula && patient.cedula.includes(this.searchTerm)
        );
      },
      error: (err) => {
        this.searchResults = [];
      }
    });
  }
  openPatientHistory(patient: any) {
    const cedula = patient.cedula || patient.documentId || patient._id;
    this.router.navigate(['/historia-clinica', cedula]);
    this.closeMenuDrawer();
  }
  logout() {
    this.authServices.deleteLocalStorage('token');
    this.authServices.deleteLocalStorage('user');
    this.authServices.deleteLocalStorage('userId');
    this.router.navigateByUrl('home');
    this.closeMenuDrawer();
  }
}
