import { ApplicationConfig} from '@angular/core';
import { provideRouter,withPreloading,PreloadAllModules } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideZoneChangeDetection } from '@angular/core';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient()
  ]
};