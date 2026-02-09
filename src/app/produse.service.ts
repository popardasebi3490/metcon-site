import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// --- INTERFEȚE ---
export interface Produs {
  id?: string;
  nume: string;
  categorie: string;
  pret?: number; // Optional, poate fi null
  imagine: string;
  descriere?: string;
}

export interface Categorie {
  id?: string;
  nume: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProduseService {
  // Injectare serviciu Firestore
  private firestore = inject(Firestore);

  // Referințe la colecțiile din baza de date
  private produseCollection = collection(this.firestore, 'produse');
  private categoriiCollection = collection(this.firestore, 'categorii');

  // =================================================
  // ZONA PUBLICĂ (CITIRE)
  // =================================================

  // Returnează lista completă de produse (Live Stream)
  getProduse(): Observable<Produs[]> {
    return collectionData(this.produseCollection, { idField: 'id' }) as Observable<Produs[]>;
  }

  // Returnează lista de categorii
  getCategorii(): Observable<Categorie[]> {
    return collectionData(this.categoriiCollection, { idField: 'id' }) as Observable<Categorie[]>;
  }

  // Returnează un singur produs după ID (Live Stream)
  // Folosim docData pentru ca modificările din editare să se vadă instant
  getProdusById(id: string): Observable<Produs | undefined> {
    const docRef = doc(this.firestore, `produse/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Produs>;
  }

  // =================================================
  // ZONA ADMIN (SCRIERE / EDITARE / ȘTERGERE)
  // =================================================

  // 1. Adaugă produs nou
  adaugaProdus(produs: Produs): Promise<any> {
    return addDoc(this.produseCollection, produs);
  }

  // 2. Actualizează produs existent (CRITIC PENTRU EDITARE)
  // Folosim Partial<Produs> pentru a permite actualizarea parțială (ex: doar prețul)
  updateProdus(id: string, data: Partial<Produs>): Promise<void> {
    const docRef = doc(this.firestore, `produse/${id}`);
    return updateDoc(docRef, data);
  }

  // 3. Șterge produs
  stergeProdus(id: string): Promise<void> {
    const docRef = doc(this.firestore, `produse/${id}`);
    return deleteDoc(docRef);
  }

  // =================================================
  // GESTIONARE CATEGORII
  // =================================================

  // Adaugă categorie
  adaugaCategorie(nume: string): Promise<any> {
    return addDoc(this.categoriiCollection, { nume });
  }

  // Șterge categorie simplu (după ID)
  async stergeCategorieCuVerificare(id: string): Promise<void> {
    const docRef = doc(this.firestore, `categorii/${id}`);
    await deleteDoc(docRef);
  }

  // Verifică dacă o categorie este folosită de produse înainte de ștergere
  // Returnează numărul de produse care folosesc categoria respectivă
  async verificaProduseInCategorie(numeCategorie: string): Promise<number> {
    const q = query(this.produseCollection, where("categorie", "==", numeCategorie));
    const snapshot = await getDocs(q);
    return snapshot.size; 
  }
}