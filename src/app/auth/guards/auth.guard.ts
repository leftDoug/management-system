import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.validateToken().pipe(
    tap((valid) => {
      if (!valid) {
        router.navigate(['./iniciar-sesion']);
      }
    })
  );
};
