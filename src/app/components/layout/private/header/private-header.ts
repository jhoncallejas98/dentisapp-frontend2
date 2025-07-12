import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthServices } from '../../../../services/auth-services';

@Component({
    selector: 'app-private-header',
    templateUrl: './private-header.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    styleUrls: ['./private-header.css']
})
export class PrivateHeader {
    @Input() menuOpen: boolean = false;
    @Output() toggleMenu = new EventEmitter<void>();

    searchTerm: string = '';
    searchResults: any[] = [];
    isDentist: boolean = false;

    constructor(private authServices: AuthServices, private router: Router) {
        const userRole = this.authServices.getCurrentUserRole();
        this.isDentist = userRole === 'dentist';
    }

    onHamburgerClick() {
        this.toggleMenu.emit();
    }

    onSearchInput() {
        // Solo permitir búsqueda si es dentista
        if (!this.isDentist) {
            return;
        }

        if (!this.searchTerm.trim()) {
            this.searchResults = [];
            return;
        }

        // Buscar pacientes por cédula automáticamente mientras se escribe
        this.authServices.getAllUsers().subscribe({
            next: (users: any) => {
                const patients = Array.isArray(users) ? users.filter(u => u.role === 'patient') : [];
                this.searchResults = patients.filter(patient => 
                    patient.cedula && patient.cedula.includes(this.searchTerm)
                );
            },
            error: (err) => {
                console.error('Error buscando pacientes:', err);
                this.searchResults = [];
            }
        });
    }

    searchPatient() {
        // Mantener el método por si se necesita el botón de búsqueda
        this.onSearchInput();
    }

    openPatientHistory(patient: any) {
        const cedula = patient.cedula || patient.documentId || patient._id;
        this.router.navigate(['/historia-clinica', cedula]);
        this.searchResults = []; // Limpiar resultados
        this.searchTerm = ''; // Limpiar búsqueda
    }

    logout() {
        this.authServices.deleteLocalStorage('token');
        this.authServices.deleteLocalStorage('user');
        this.authServices.deleteLocalStorage('userId');
        this.router.navigateByUrl('home');
    }
}