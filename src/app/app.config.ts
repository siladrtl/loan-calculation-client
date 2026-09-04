import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import {
  provideRouter
} from '@angular/router';

import {
  registerLocaleData
} from '@angular/common';

import localeTr
  from '@angular/common/locales/tr';

import {
  authInterceptor
} from './services/auth/auth.interceptor';

import {
  routes
} from './app.routes';


registerLocaleData(
  localeTr
);


export const appConfig: ApplicationConfig = {

  providers: [

    provideBrowserGlobalErrorListeners(),

    provideRouter(
      routes
    ),

    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    ),

    {
      provide: LOCALE_ID,
      useValue: 'tr-TR'
    }

  ]

};