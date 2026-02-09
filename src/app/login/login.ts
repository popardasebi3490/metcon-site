import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Necesar pentru [(ngModel)]
import { AuthService } from '../auth'; // Asigura-te ca calea e corecta

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html', 
  styleUrl: './login.css'      
})
export class LoginComponent { 
  user: string = ''; 
  pass: string = '';
  eroare = false;
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  async incearcaLogin() {
    // Resetam starea
    this.eroare = false;
    this.loading = true;

    // Verificare simpla sa nu trimitem campuri goale
    if (!this.user || !this.pass) {
        this.eroare = true;
        this.loading = false;
        return;
    }

    // Apelam serviciul Auth
    const succes = await this.auth.login(this.user, this.pass);

    if (succes) {
      console.log('Login reusit! Redirectionez...');
      this.router.navigate(['/admin']); 
    } else {
      this.eroare = true; // Afiseaza mesajul de eroare
    }
    
    this.loading = false;
  }
}