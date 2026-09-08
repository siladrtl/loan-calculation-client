import { Routes } from '@angular/router';

import { Login } from './components/ui/login/login';

import { Register } from './components/ui/register/register';

import { LoanCalculator } from './components/ui/loan-calculator';

import { MyApplications } from './components/ui/my-applications/my-applications';

import { AdminApplications } from './components/ui/admin-applications/admin-applications';

import {
  AdminCustomerVerifications
} from './components/ui/admin-customer-verifications/admin-customer-verifications';


export const routes: Routes = [

  // ==========================================
  // LOGIN
  // ==========================================

  {
    path: 'login',
    component: Login
  },


  // ==========================================
  // REGISTER
  // ==========================================

  {
    path: 'register',
    component: Register
  },


  // ==========================================
  // CUSTOMER - BAŞVURULARIM
  // ==========================================

  {
    path: 'my-applications',
    component: MyApplications
  },


  // ==========================================
  // ADMIN - KREDİ BAŞVURULARI
  // ==========================================

  {
    path: 'admin/applications',
    component: AdminApplications
  },


  // ==========================================
  // ADMIN - MÜŞTERİ BAŞVURULARI
  // ==========================================

  {
    path: 'admin/customer-verifications',
    component: AdminCustomerVerifications
  },


  // ==========================================
  // ANA SAYFA
  // ==========================================

  {
    path: '',
    component: LoanCalculator
  },


  // ==========================================
  // BULUNAMAYAN SAYFALAR
  // ==========================================

  {
    path: '**',
    redirectTo: ''
  }

];