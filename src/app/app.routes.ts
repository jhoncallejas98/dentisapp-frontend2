import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { DashboardComponent } from './pages/private/dashboard/dashboard';
import { AppoimentsComponent } from './pages/private/appoiments/appoiments';
import { PatientsListComponent } from './pages/private/patients-list/patients-list';
import { CalendarComponent } from './pages/private/calendar/calendar';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'appoiments',
    component: AppoimentsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'patients-list',
    component: PatientsListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [authGuard]
  }
];
