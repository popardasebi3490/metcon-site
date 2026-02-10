import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ProduseComponent } from './produse/produse'; 
import { authGuard } from './auth.guard';
import { DespreComponent } from './despre/despre';
import { Contact } from './contact/contact';
import { AdminComponent } from './admin/admin';
import { LoginComponent } from './login/login';
import { CariereComponent } from './cariere/cariere'; 
import { ProdusDetaliuComponent } from './produs-detaliu/produs-detaliu';
import { SeapComponent } from './seap/seap.component';

export const routes: Routes = [
  { path: '', component: Home },
  
  { path: 'produse', component: ProduseComponent },
  { path: 'produs/:id', component: ProdusDetaliuComponent },
  
  { path: 'despre', component: DespreComponent },
  { path: 'cariere', component: CariereComponent }, 
  { path: 'contact', component: Contact },
  
  { path: 'seap', component: SeapComponent },

  // Rute protejate
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  
  // Ruta Wildcard 
  { path: '**', redirectTo: '' }
];