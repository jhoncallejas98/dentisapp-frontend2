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
import { Plans } from './pages/public/plans/plans';
import { Contact } from './pages/public/contact/contact';
import { HistoriaClinica } from './pages/private/historia-clinica/historia-clinica';
import { PrivateLayout } from './components/layout/private/private-layout.component';
import { PublicLayout } from './components/layout/public/public-layout.component';
import { DashboardUsers } from './pages/private/dashboard-users/dashboard-users';
import { FormulaUsers } from './pages/private/formula-users/formula-users';
import { AddPatient } from './pages/private/add-patient/add-patient';
import { PatientsList } from './pages/private/patients-list/patients-list';
import { EditAvailability } from './pages/private/edit-availability/edit-availability';
import { AvailabilityList } from './pages/private/availability-list/availability-list';
import { Calendar } from './pages/private/calendar/calendar';

export const routes: Routes = [
    {
    path: '',
    component: PublicLayout,
    children: [
        { path: "home", component: Home },
        { path: "login", component: Login },
        { path: "register", component: Register },
        { path: "plans", component: Plans },
        { path: "contact", component: Contact },
        { path: "", redirectTo: "home", pathMatch: "full" }
        ]
    },
    {
    path: '',
    component: PrivateLayout,
    children: [
        { path: "historia-clinica", component: HistoriaClinica, canActivate: [authGuard] },
        { path: 'formula-medica', component: FormulaMedica, canActivate: [authGuard] },
        { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
        { path: 'dashboard-users', component: DashboardUsers, canActivate: [authGuard] },
        { path: 'formula-users', component: FormulaUsers, canActivate: [authGuard] },
        { path: 'disponibilidad', component: Odontologodisponible, canActivate: [authGuard] },

        { path: "admin/disponibilidad", component: Odontologodisponible, canActivate: [authGuard] },
        { path: "admin/appoiments", component: Appoiments, canActivate: [authGuard] },
        { path: "admin/appoiments/AppoimentsNewForms", component: AppoimentsNewForm, canActivate: [authGuard] },
        { path: "admin/patients", component: PatientsList, canActivate: [authGuard] },
        { path: "admin/patients/add", component: AddPatient, canActivate: [authGuard] },
        { path: "admin/patients/edit/:id", component: AddPatient, canActivate: [authGuard] },
        { path: "admin/patients/view/:id", component: AddPatient, canActivate: [authGuard] },
        { path: "admin/availability/edit/:id", component: EditAvailability, canActivate: [authGuard] },
        { path: "admin/availability", component: AvailabilityList, canActivate: [authGuard] },
        { path: "admin/calendar", component: Calendar, canActivate: [authGuard] }
        ]
    },
    { path: "**", redirectTo: "home", pathMatch: "full" }
];
