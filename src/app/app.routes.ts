import { Routes } from '@angular/router';
import { Home } from './pages/public/home/home';
import { Login } from './pages/public/login/login';
import { Register } from './pages/public/register/register';
import { Odontologodisponible } from './pages/private/odontologodisponible/odontologodisponible';

export const routes: Routes = [
    { path: "home" ,component: Home},
    { path: "login" , component: Login},
    { path: "register" , component: Register},

    { path: "admin/disponibilidad", component: Odontologodisponible },

    { path: "**", redirectTo:"home", pathMatch:"full"},
    { path: "", redirectTo: "home", pathMatch: "full"},

];
