import { Routes } from '@angular/router';

import { Login } from './components/ui/login/login';
import { LoanCalculator } from './components/ui/loan-calculator';

export const routes: Routes = [

  {
    path: 'login',
    component: Login
  },

  {
    path: '',
    component: LoanCalculator
  }

];