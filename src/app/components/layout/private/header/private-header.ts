import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthServices } from '../../../../services/auth-services';

@Component({
    selector: 'app-private-header',
    templateUrl: './private-header.html',
    standalone: true,
    imports: [],
    styleUrls: ['./private-header.css']
})
export class PrivateHeader {
    menuOpen = false;

    constructor(private authServices: AuthServices, private router: Router) {}

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    logout() {
        this.authServices.deleteLocalStorage('token');
        this.router.navigateByUrl('home');
    }
}