import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { provideRouter, withDebugTracing } from '@angular/router'; 

bootstrapApplication(App, {
  providers: [provideRouter(routes, withDebugTracing())], 
}).catch(err => console.error(err));
