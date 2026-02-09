import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Observable } from 'rxjs';

// IMPORTURILE NOASTRE
import { ProduseService, Produs } from '../produse.service';
import { AuthService } from '../auth'; // <--- Folosim serviciul tau custom

@Component({
  selector: 'app-produs-detaliu',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './produs-detaliu.html',
  styleUrl: './produs-detaliu.css'
})
export class ProdusDetaliuComponent implements OnInit {
  produs: Produs | undefined;
  produsEditat: Produs = {} as Produs;
  loading: boolean = true;
  editMode: boolean = false;

  // Injectam serviciile
  private route = inject(ActivatedRoute);
  private service = inject(ProduseService);
  public auth = inject(AuthService); // <--- Public ca sa il vedem in HTML

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.incarcaProdus(id);
    }
  }

  incarcaProdus(id: string) {
    this.service.getProdusById(id).subscribe((data) => {
      this.produs = data;
      this.loading = false;
      // Facem o copie pentru editare
      if(data) this.produsEditat = { ...data };
    });
  }

  activeazaEditarea() {
    this.editMode = true;
    if (this.produs) {
      this.produsEditat = { ...this.produs }; 
    }
  }

  anuleazaEditarea() {
    this.editMode = false;
  }

  async salveazaModificari() {
    if (this.produsEditat && this.produs?.id) {
      try {
        // Trimitem doar datele, fara ID (ID-ul e in URL)
        const { id, ...dateDeSalvat } = this.produsEditat;
        
        await this.service.updateProdus(this.produs.id, dateDeSalvat);
        
        this.editMode = false;
        alert('Produs actualizat cu succes!');
      } catch (error) {
        console.error(error);
        alert('Eroare la actualizare.');
      }
    }
  }
}