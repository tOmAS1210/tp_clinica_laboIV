import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyAzyJ4lRb9I4Pr7ujA6aWpWGLRItDzITn8',
        authDomain: 'laboratorio-iv-551eb.firebaseapp.com',
        projectId: 'laboratorio-iv-551eb',
        storageBucket: 'laboratorio-iv-551eb.appspot.com',
        messagingSenderId: '894803633901',
        appId: '1:894803633901:web:cf3c5148e1af8e5aad4ee4',
        measurementId: 'G-KBFGRC7B51',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    importProvidersFrom(BrowserAnimationsModule),
  ],
};
