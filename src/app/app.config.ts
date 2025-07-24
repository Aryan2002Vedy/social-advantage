import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { ReactiveFormsModule } from '@angular/forms';

//lottie
import player from 'lottie-web';
import { provideLottieOptions } from 'ngx-lottie';

// Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

// Material (optional if you use Material theming/components later)
import { provideAnimations } from '@angular/platform-browser/animations';

// Translation
import { importProvidersFrom } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {  HttpClient , HttpClientModule } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


export function playerFactory() {
  return player;
}

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideLottieOptions({ player: () => player }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),

    // Firebase Providers
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    // i18n
    importProvidersFrom(
      HttpClientModule,
      ReactiveFormsModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
};
