import { Injectable } from '@angular/core';
import {
  CanActivateFn,
  Router,
} from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true); // ✅ Allow access
      } else {
        router.navigate(['/login']); // ❌ Not logged in, redirect
        resolve(false);
      }
    });
  });
};
