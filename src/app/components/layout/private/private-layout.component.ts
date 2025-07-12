import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrivateHeader } from './header/private-header';
import { PrivateFooter } from './footer/private-footer';
import { AsideBar } from '../../aside-bar-dentist/aside-bar';

@Component({
    selector: 'app-private-layout',
    standalone: true,
    imports: [RouterOutlet, PrivateHeader, PrivateFooter, AsideBar],
    template: `
        <app-private-header [menuOpen]="menuOpen" (toggleMenu)="menuOpen = !menuOpen"></app-private-header>
        <app-aside-bar [menuOpen]="menuOpen" (closeMenu)="menuOpen = false"></app-aside-bar>
        <router-outlet></router-outlet>
        <app-private-footer></app-private-footer>
    `
})
export class PrivateLayout {
    menuOpen = false;
}