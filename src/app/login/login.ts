import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../auth'; 

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
  showPassword = false; // Adăugat pentru ochiul de la parolă

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async incearcaLogin() {
    this.eroare = false;
    this.loading = true;

    if (!this.user || !this.pass) {
        this.eroare = true;
        this.loading = false;
        return;
    }

    const succes = await this.auth.login(this.user, this.pass);

    if (succes) {
      this.router.navigate(['/admin']); 
    } else {
      this.eroare = true;
    }
    
    this.loading = false;
  }
}