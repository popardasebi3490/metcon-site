import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router';

import { AuthService, User } from '../auth'; 
import { ProduseService, Produs, Categorie } from '../produse.service'; 

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './admin.html', 
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  
  // --- DATE PRODUSE ---
  produsNou: any = { nume: '', descriere: '', pret: null, imagine: '', categorie: '' };
  numeCategorieNoua: string = ''; 
  produse: Produs[] = [];
  categorii: Categorie[] = []; 
  loading: boolean = true;

  // --- FILTRARE & SEARCH ---
  searchTerm: string = '';
  filtruCategorie: string = '';

  // --- DATE MANAGER ---
  isManager: boolean = false;
  listaUseri: User[] = [];
  numeAdminNou: string = '';
  parolaAdminNou: string = '';

  constructor(
    public auth: AuthService,
    private service: ProduseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.isManager = user.role === 'manager';
        if (this.isManager) {
          this.incarcaListaUseri();
        }
      }
    });
    
    this.incarcaProduseSiCategorii();
  }

  get produseFiltrate() {
    return this.produse.filter(p => {
      const matchNume = p.nume.toLowerCase().includes(this.searchTerm.toLowerCase());
      let matchCategorie = true;
      if (this.filtruCategorie) {
         matchCategorie = p.categorie === this.filtruCategorie;
      }
      return matchNume && matchCategorie;
    });
  }

  async incarcaListaUseri() {
    this.listaUseri = await this.auth.getUsers();
  }

  async adaugaAdminNou() {
    if (this.numeAdminNou && this.parolaAdminNou) {
      try {
        await this.auth.createAdmin(this.numeAdminNou, this.parolaAdminNou);
        this.numeAdminNou = '';
        this.parolaAdminNou = '';
        await this.incarcaListaUseri(); 
        alert('Admin creat cu succes!');
      } catch (e) {
        alert('Eroare la creare user.');
      }
    } else {
      alert('Completează nume și parolă!');
    }
  }

  async stergeUser(id: string | undefined, role: string) {
    if (!id) return;
    if (role === 'manager') {
      alert('Nu poți șterge managerul principal!');
      return;
    }
    if (confirm('Sigur ștergi acest admin?')) {
      await this.auth.deleteUser(id);
      await this.incarcaListaUseri();
    }
  }

  incarcaProduseSiCategorii() {
    this.loading = true;
    this.service.getProduse().subscribe(data => {
      this.produse = data;
      this.loading = false;
    });
    this.service.getCategorii().subscribe(data => {
      this.categorii = data;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.produsNou.imagine = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async adaugaProdus() {
    // 1. Validare
    if (!this.produsNou.nume || !this.produsNou.categorie) {
      alert('Te rog completează Numele și Categoria!');
      return;
    }

    // 2. Pregatire date (Price convertit la numar)
    const produsDeTrimis: any = {
      nume: this.produsNou.nume,
      categorie: this.produsNou.categorie,
      // Daca e gol, punem null. Daca are valoare, o facem numar (nu text)
      pret: this.produsNou.pret ? Number(this.produsNou.pret) : null,
      imagine: this.produsNou.imagine || 'https://placehold.co/600x400?text=Fara+Poza',
      descriere: this.produsNou.descriere || ''
    };

    try {
      await this.service.adaugaProdus(produsDeTrimis);
      
      // Resetare
      this.produsNou = { nume: '', descriere: '', pret: null, imagine: '', categorie: '' };
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if(fileInput) fileInput.value = '';
      
      alert('Produs adăugat cu succes!');
    } catch (err) {
      console.error(err);
      alert('Eroare la adăugare! (Verifică consola F12)');
    }
  }

  async stergeProdus(id: string | undefined) {
    if (!id) return;
    if (confirm('Sigur vrei să ștergi acest produs?')) {
      await this.service.stergeProdus(id);
    }
  }

  async adaugaCategorie() {
    if (this.numeCategorieNoua.trim()) {
      await this.service.adaugaCategorie(this.numeCategorieNoua.trim());
      this.numeCategorieNoua = ''; 
    }
  }

  async stergeCategorie(id: string | undefined, nume: string) {
    if (!id) return;
    const nrProduse = await this.service.verificaProduseInCategorie(nume);
    
    let mesaj = `Sigur ștergi categoria "${nume}"?`;
    if (nrProduse > 0) {
      mesaj += `\n\nATENȚIE: Această categorie este folosită de ${nrProduse} produse!\nDacă continui, produsele vor rămâne "Neclasificate".`;
    }

    if (confirm(mesaj)) {
      try {
        await this.service.stergeCategorieCuVerificare(id);
        alert("Categoria a fost ștearsă.");
      } catch (e) {
        console.error(e);
        alert('A apărut o eroare la ștergerea categoriei.');
      }
    }
  }

  logout() {
    this.auth.logout();
  }
}