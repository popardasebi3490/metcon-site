import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Observable } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser'; // <--- Importuri SEO

// IMPORTURILE NOASTRE
import { ProduseService, Produs } from '../produse.service';
import { AuthService } from '../auth'; 

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
  public auth = inject(AuthService); 
  
  // Servicii pentru SEO (Titlu Browser + Meta Description)
  private titleService = inject(Title);
  private metaService = inject(Meta);

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
      
      if (data) {
        // 1. Pregatim datele pentru editare
        this.produsEditat = { ...data };

        // 2. SEO: Schimbam Titlul Tab-ului (ex: "Ciment | Metcon")
        this.titleService.setTitle(`${data.nume} | Metcon Adjud`);

        // 3. SEO: Schimbam Descrierea pentru Google
        const descriereScurta = data.descriere 
          ? data.descriere.substring(0, 150) // Luam primele 150 caractere
          : `Cumpără ${data.nume} de la Metcon Adjud. Materiale de construcții de calitate.`;

        this.metaService.updateTag({ name: 'description', content: descriereScurta });
      }
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
        // Trimitem doar datele, fara ID (ID-ul e deja in URL)
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