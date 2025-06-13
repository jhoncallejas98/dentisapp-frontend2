import { Routes } from '@angular/router';
import { Home } from './pages/public/home/home';
import { Login } from './pages/public/login/login';
import { Register } from './pages/public/register/register';
import { Odontologodisponible } from './pages/private/odontologodisponible/odontologodisponible';
import { Appoiments } from './pages/private/appoiments/appoiments';

export const routes: Routes = [
    { path: "home" ,component: Home},
    { path: "login" , component: Login},
    { path: "register" , component: Register},
    { path: "admin/disponibilidad", component: Odontologodisponible },
    { path: "appoiments", component: Appoiments},
    // { path: "who-we-are", component: whoWeAre},
    // { path: "plans", component: plans},
    // { path: "contact", component: contact},
    { path: "", redirectTo: "home", pathMatch: "full"},
    { path: "**", redirectTo:"home", pathMatch:"full"}

];
