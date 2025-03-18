import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (isBrowser && localStorage.getItem('email') != null ||  localStorage.getItem('jwtToken') != null) {
    return true;
  } else {
    if (isBrowser) {
      // toastr.warning('Unauthorized access');
      router.navigateByUrl('/login');
    }
    return false;
  }
};
