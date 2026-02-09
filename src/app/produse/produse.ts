import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterLink } from '@angular/router'; 

// Importam serviciul de alaturi
import { ProduseService, Produs, Categorie } from '../produse.service'; 

@Component({
  selector: 'app-produse',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './produse.html', 
  styleUrl: './produse.css'
})
export class ProduseComponent implements OnInit {
  toateProdusele: Produs[] = [];
  produseAfisate: Produs[] = []; 
  categorii: Categorie[] = []; 
  termenCautare: string = '';
  categorieSelectata: string = 'Toate';
  loading: boolean = true;

  constructor(private service: ProduseService) {}

  ngOnInit() {
    this.loading = true;
    this.service.getProduse().subscribe((data) => {
      this.toateProdusele = data;
      this.filtreaza(); 
      this.loading = false;
    });
    this.service.getCategorii().subscribe((data) => {
      this.categorii = data;
    });
  }

  filtreaza() {
    this.produseAfisate = this.toateProdusele.filter(p => {
      const eCategorieBuna = (this.categorieSelectata === 'Toate') || (p.categorie === this.categorieSelectata);
      const text = this.termenCautare.toLowerCase();
      const eTextBun = p.nume.toLowerCase().includes(text);
      return eCategorieBuna && eTextBun;
    });
  }

  schimbaCategoria(cat: string) {
    this.categorieSelectata = cat;
    this.termenCautare = ''; 
    this.filtreaza();
  }
}