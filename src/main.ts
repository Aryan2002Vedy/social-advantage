import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { TranslateService } from '@ngx-translate/core';
import AOS from 'aos';
AOS.init();

bootstrapApplication(AppComponent, appConfig).then(appRef => {
  const injector = appRef.injector;
  const translate = injector.get(TranslateService);

  translate.addLangs(['en', 'hi']);
  translate.setDefaultLang('en');
  translate.use('en'); // 👈 change to 'hi' if needed
});
// This file is the entry point for the Angular application.
// It bootstraps the AppComponent with the provided application configuration.