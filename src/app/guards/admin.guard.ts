import { inject } from '@angular/core';
import {CanMatchFn , Router} from '@angular/router';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanMatchFn =
  () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.tieneRol('admin')) {
      return true;
    }
    return router.parseUrl('/login');
  };