import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, collection, query, where, getDocs, addDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

// Definim interfata User pentru a sti ce date avem
export interface User {
  id?: string;
  username: string;
  password?: string;
  role: 'manager' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  // Starea utilizatorului curent (BehaviorSubject retine ultima valoare)
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    // La refresh (F5), verificam daca avem utilizator salvat in LocalStorage
    const savedUser = localStorage.getItem('user_metcom');
    if (savedUser) {
      try {
        this.userSubject.next(JSON.parse(savedUser));
      } catch (e) {
        console.error("Eroare la parse user:", e);
        localStorage.removeItem('user_metcom');
      }
    }
  }

  // --- LOGIN (Verifica in Firebase 'users') ---
  async login(username: string, pass: string): Promise<boolean> {
    try {
      const usersRef = collection(this.firestore, 'users');
      
      // Cautam documentul care are exact acel username si acea parola
      const q = query(
        usersRef, 
        where('username', '==', username), 
        where('password', '==', pass)
      );
      
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Am gasit userul!
        const docSnap = snapshot.docs[0];
        const docData = docSnap.data();

        const userLogat: User = { 
          id: docSnap.id,
          username: docData['username'],
          role: docData['role'],
          // Nu e obligatoriu sa tii parola in sesiune, dar o pastram pentru consistenta interfetei
          password: docData['password'] 
        };

        // Salvam sesiunea in aplicatie si in browser
        this.userSubject.next(userLogat);
        localStorage.setItem('user_metcom', JSON.stringify(userLogat));
        return true;
      }
    } catch (e) {
      console.error('Eroare login:', e);
    }
    return false; // Login esuat
  }

  // --- LOGOUT ---
  logout() {
    localStorage.removeItem('user_metcom');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Helper: Returneaza valoarea curenta fara subscribe
  get currentUserValue(): User | null {
    return this.userSubject.value;
  }

  // --- METODE PENTRU MANAGER (Gestionare Staff) ---

  // 1. Obtine toti utilizatorii (doar daca esti manager)
  async getUsers(): Promise<User[]> {
    if (this.currentUserValue?.role !== 'manager') return [];
    
    try {
      const usersRef = collection(this.firestore, 'users');
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map(d => {
        const data = d.data();
        return { 
          id: d.id, 
          username: data['username'], 
          role: data['role'],
          password: data['password']
        } as User;
      });
    } catch (error) {
      console.error("Eroare la preluare useri:", error);
      return [];
    }
  }

  // 2. Creeaza Admin nou
  async createAdmin(username: string, pass: string) {
    if (this.currentUserValue?.role !== 'manager') return;

    const usersRef = collection(this.firestore, 'users');
    await addDoc(usersRef, {
      username: username,
      password: pass,
      role: 'admin' // Implicit cream admin simplu, nu manager
    });
  }

  // 3. Sterge Admin
  async deleteUser(id: string) {
    if (this.currentUserValue?.role !== 'manager') return;
    
    const docRef = doc(this.firestore, `users/${id}`);
    await deleteDoc(docRef);
  }
}