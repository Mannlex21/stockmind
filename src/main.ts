import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { LucideFileText, provideLucideIcons } from '@lucide/angular';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideLucideIcons(LucideFileText), // <--- Pasar el icono directamente
  ],
}).catch((err) => console.error(err));
