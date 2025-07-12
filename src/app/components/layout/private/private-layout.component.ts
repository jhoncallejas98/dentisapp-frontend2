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
        <div class="layout-container">
            <app-private-header [menuOpen]="menuOpen" (toggleMenu)="menuOpen = !menuOpen"></app-private-header>
            <div class="content-wrapper">
                <app-aside-bar [menuOpen]="menuOpen" (closeMenu)="menuOpen = false"></app-aside-bar>
                <main class="main-content">
                    <router-outlet></router-outlet>
                </main>
            </div>
            <app-private-footer></app-private-footer>
        </div>
    `,
    styles: [`
        .layout-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        
        .content-wrapper {
            display: flex;
            flex: 1;
        }
        
        .main-content {
            flex: 1;
            background-color: #f9f9f9;
        }
        
        @media (max-width: 900px) {
            .content-wrapper {
                flex-direction: column;
            }
        }
    `]
})
export class PrivateLayout {
    menuOpen = false;
}