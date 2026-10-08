// O app usa provideZoneChangeDetection em app.config.ts.
// Angular precisa que Zone.js seja carregado antes do bootstrap.
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
