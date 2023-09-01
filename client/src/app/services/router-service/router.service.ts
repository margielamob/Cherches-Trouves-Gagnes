import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class RouterService {
    constructor(private readonly router: Router) {}

    redirectToErrorPage() {
        this.navigateTo('error');
    }
    reloadPage(page: string): void {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([`/${page}`]);
        });
    }

    navigateTo(page: string) {
        this.router.navigate([`/${page}`]);
    }
}
