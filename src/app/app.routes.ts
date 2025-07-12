import { Routes } from '@angular/router';
import { Home } from './pages/public/home/home';
import { Login } from './pages/public/login/login';
import { Register } from './pages/public/register/register';
import { Odontologodisponible } from './pages/private/odontologodisponible/odontologodisponible';
import { AppoimentsComponent } from './pages/private/appoiments/appoiments';
import { AppoimentsNewForm } from './pages/private/appoiments/new-form/new-form';
import { AppoimentUsers } from './pages/private/appoiment-users/appoiment-users';
import { FormulaMedica } from './pages/private/formula-medica/formula-medica';
import { DashboardComponent } from './pages/private/dashboard/dashboard';
import { authGuard, dentistGuard, patientGuard } from './guards/auth-guard';
import { Plans } from './pages/public/plans/plans';
import { Contact } from './pages/public/contact/contact';
import { HistoriaClinica } from './pages/private/historia-clinica/historia-clinica';
import { PrivateLayout } from './components/layout/private/private-layout.component';
import { PublicLayout } from './components/layout/public/public-layout.component';
import { DashboardUsers } from './pages/private/dashboard-users/dashboard-users';
import { FormulaUsers } from './pages/private/formula-users/formula-users';
import { AddPatient } from './pages/private/add-patient/add-patient';
import { PatientsListComponent } from './pages/private/patients-list/patients-list';
import { EditAvailability } from './pages/private/edit-availability/edit-availability';
import { AvailabilityList } from './pages/private/availability-list/availability-list';
import { CalendarComponent } from './pages/private/calendar/calendar';
import { IncapacidadUsers } from './pages/private/incapacidad-users/incapacidad-users';
import { NewForm } from './pages/private/appoiments-users/new-form/new-form';
import { IncapacidadMedica } from './pages/private/incapacidad-medica/incapacidad-medica';

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
      // Rutas compartidas (accesibles para todos los usuarios autenticados)
      { path: "historia-clinica/:documento", component: HistoriaClinica, canActivate: [authGuard] },
      
      // Rutas específicas para DOCTORES/ADMIN
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, dentistGuard] },
      { path: 'formula-medica', component: FormulaMedica, canActivate: [authGuard, dentistGuard] },
      { path: 'incapacidad-medica', component: IncapacidadMedica, canActivate: [authGuard, dentistGuard] },
      { path: 'disponibilidad', component: EditAvailability, canActivate: [authGuard, dentistGuard] },
      { path: 'disponibilidad/:id', component: EditAvailability, canActivate: [authGuard, dentistGuard] },
      { path: "admin/disponibilidad", component: Odontologodisponible, canActivate: [authGuard, dentistGuard] },
      { path: "admin/appoiments", component: AppoimentsComponent, canActivate: [authGuard, dentistGuard] },
      { path: "admin/appoiments/new", component: AppoimentsNewForm, canActivate: [authGuard, dentistGuard] },
      { path: "admin/appoiments/AppoimentsNewForms", component: AppoimentsNewForm, canActivate: [authGuard, dentistGuard] },
      { path: "admin/patients", component: PatientsListComponent, canActivate: [authGuard, dentistGuard] },
      { path: "add-patient", component: AddPatient, canActivate: [authGuard, dentistGuard] },
      { path: "admin/patients/add", component: AddPatient, canActivate: [authGuard, dentistGuard] },
      { path: "admin/patients/edit/:id", component: AddPatient, canActivate: [authGuard, dentistGuard] },
      { path: "admin/patients/view/:id", component: AddPatient, canActivate: [authGuard, dentistGuard] },
      { path: "admin/availability/edit/:id", component: EditAvailability, canActivate: [authGuard, dentistGuard] },
      { path: "admin/availability", component: AvailabilityList, canActivate: [authGuard, dentistGuard] },
      { path: "admin/calendar", component: CalendarComponent, canActivate: [authGuard, dentistGuard] },
      { path: "calendar", component: CalendarComponent, canActivate: [authGuard, dentistGuard] },
      { path: "appoiments", component: AppoimentsComponent, canActivate: [authGuard, dentistGuard] },
      { path: "appoiments/new", component: AppoimentsNewForm, canActivate: [authGuard, dentistGuard] },
      { path: "patients", component: PatientsListComponent, canActivate: [authGuard, dentistGuard] },
      
      // Rutas específicas para PACIENTES
      { path: 'dashboard-users', component: DashboardUsers, canActivate: [authGuard, patientGuard] },
      { path: 'formula-users', component: FormulaUsers, canActivate: [authGuard, patientGuard] },
      { path: 'appoiment-users', component: AppoimentUsers, canActivate: [authGuard, patientGuard] },
      { path: 'appoiments-users/new-form', component: NewForm, canActivate: [authGuard, patientGuard] },
      { path: "incapacidad/:cedula", component: IncapacidadUsers, canActivate: [authGuard, patientGuard] }
    ]
  },
  { path: "**", redirectTo: "home", pathMatch: "full" }
];
