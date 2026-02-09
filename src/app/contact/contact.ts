import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesar
import emailjs from '@emailjs/browser'; // Importam libraria

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact { 
  nume: string = '';
  email: string = '';
  mesaj: string = '';

  trimiteEmail() {
    if(!this.nume || !this.email || !this.mesaj) {
      alert("Completează toate câmpurile!");
      return;
    }

    const templateParams = {
      from_name: this.nume,
      reply_to: this.email,
      message: this.mesaj,
      to_name: 'Metcon Staff'
    };

    const SERVICE_ID = 'service_9ojdvgh';
    const TEMPLATE_ID = 'template_wtvisw6'; 
    const PUBLIC_KEY = 'FcvDFvcRnk_bCjA1X'; 

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        alert('Mesaj trimis cu succes!');
        this.nume = ''; this.email = ''; this.mesaj = '';
      }, (err) => {
        alert('Eroare la trimitere. Încearcă mai târziu.');
        console.error(err);
      });
  }
}