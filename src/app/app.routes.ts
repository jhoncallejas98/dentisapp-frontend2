import { Routes } from '@angular/router';
import { Home } from './pages/public/home/home';
import { Login } from './pages/public/login/login';
import { Register } from './pages/public/register/register';
import { Odontologodisponible } from './pages/private/odontologodisponible/odontologodisponible';
import { Appoiments } from './pages/private/appoiments/appoiments';
import { AppoimentsNewForm } from './pages/private/appoiments/new-form/new-form';
import { FormulaMedica } from './pages/private/formula-medica/formula-medica';
import { Dashboard } from './pages/private/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: "home" ,component: Home},
    { path: "login" , component: Login},
    { path: "register" , component: Register},
    { path: 'formula-medica', component: FormulaMedica, canActivate:[authGuard] },
    { path: 'dashboard', component: Dashboard ,  canActivate:[authGuard]},
    { path: "admin/disponibilidad", component: Odontologodisponible,  canActivate:[authGuard] },
    { path: "admin/appoiments", component: Appoiments,  canActivate:[authGuard]},
    { path: "admin/appoiments/AppoimentsNewForms", component: AppoimentsNewForm,  canActivate:[authGuard]},



    // { path: "who-we-are", component: whoWeAre},
    // { path: "plans", component: plans},
    // { path: "contact", component: contact},
    { path: "", redirectTo: "home", pathMatch: "full"},
    { path: "**", redirectTo:"home", pathMatch:"full"}

];
