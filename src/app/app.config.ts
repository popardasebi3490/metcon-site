import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCdjAc0jHfQFIqylyeMmjunOK-TGcroPqc",
  authDomain: "metcon-srl.firebaseapp.com",
  projectId: "metcon-srl",
  storageBucket: "metcon-srl.firebasestorage.app",
  messagingSenderId: "1032504090289",
  appId: "1:1032504090289:web:80362dad09abeb2d560c90",
  measurementId: "G-HTWKEGM61L"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    
    // Initializam Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};