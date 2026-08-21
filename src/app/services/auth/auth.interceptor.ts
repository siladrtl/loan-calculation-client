import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { LoginService } from './login';

export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const loginService =
    inject(LoginService);

  const token =
    loginService.getToken();

  if (!token) {
    return next(req);
  }

  const authRequest =
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  return next(authRequest);
};