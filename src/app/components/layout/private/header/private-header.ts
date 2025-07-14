import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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
    showDropdown: boolean = false;

    constructor(private authServices: AuthServices, private router: Router, private cdr: ChangeDetectorRef) {
        const userRole = this.authServices.getCurrentUserRole();
        this.isDentist = userRole === 'dentist';
    }

    ngOnInit() {
        document.addEventListener('click', this.handleClickOutside.bind(this));
    }

    ngOnDestroy() {
        document.removeEventListener('click', this.handleClickOutside.bind(this));
    }

    handleClickOutside(event: MouseEvent) {
        const searchBar = document.querySelector('.search-bar');
        if (searchBar && !searchBar.contains(event.target as Node)) {
            this.showDropdown = false;
            this.cdr.detectChanges();
        }
    }

    onHamburgerClick() {
        this.toggleMenu.emit();
    }

    onSearchInput() {
        // Solo permitir búsqueda si es dentista
        if (!this.isDentist) {
            this.showDropdown = false;
            return;
        }

        if (!this.searchTerm.trim()) {
            this.searchResults = [];
            this.showDropdown = false;
            this.cdr.detectChanges();
            return;
        }

        const term = this.searchTerm.trim().toLowerCase();
        // Buscar pacientes por cédula, documentId, _id o nombre automáticamente mientras se escribe
        this.authServices.getAllUsers().subscribe({
            next: (users: any) => {
                const patients = Array.isArray(users) ? users.filter(u => u.role === 'patient') : [];
                this.searchResults = patients.filter(patient => {
                    const cedula = (patient.cedula || '').toString().toLowerCase();
                    const docId = (patient.documentId || '').toString().toLowerCase();
                    const id = (patient._id || '').toString().toLowerCase();
                    const name = (patient.name || (patient.firstName + ' ' + patient.lastName) || '').toLowerCase();
                    return cedula.includes(term) || docId.includes(term) || id.includes(term) || name.includes(term);
                });
                this.showDropdown = this.searchResults.length > 0 && !!this.searchTerm;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.searchResults = [];
                this.showDropdown = false;
                this.cdr.detectChanges();
            }
        });
    }

    searchPatient() {
        this.onSearchInput();
    }

    openPatientHistory(patient: any) {
        const cedula = patient.cedula || patient.documentId || patient._id;
        this.router.navigate(['/historia-clinica', cedula]);
        this.searchResults = []; // Limpiar resultados
        this.searchTerm = ''; // Limpiar búsqueda
        this.showDropdown = false;
    }

    logout() {
        this.authServices.deleteLocalStorage('token');
        this.authServices.deleteLocalStorage('user');
        this.authServices.deleteLocalStorage('userId');
        this.router.navigateByUrl('home');
    }
}