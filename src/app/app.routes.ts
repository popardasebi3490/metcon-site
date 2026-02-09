import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ProduseComponent } from './produse/produse'; 

import { DespreComponent } from './despre/despre';
import { Contact } from './contact/contact';
import { AdminComponent } from './admin/admin';
import { LoginComponent } from './login/login';
import { CariereComponent } from './cariere/cariere'; 
import { ProdusDetaliuComponent } from './produs-detaliu/produs-detaliu';

export const routes: Routes = [
  { path: '', component: Home },
  
  // 3. AICI TREBUIE SA FIE COMPONENTA:
  { path: 'produse', component: ProduseComponent },
  
  { path: 'despre', component: DespreComponent },
  { path: 'cariere', component: CariereComponent }, 
  { path: 'contact', component: Contact},
  { path: 'admin', component: AdminComponent },
  { path: 'login', component: LoginComponent },
  { path: 'produs/:id', component: ProdusDetaliuComponent },
  { path: '**', redirectTo: '' }
];