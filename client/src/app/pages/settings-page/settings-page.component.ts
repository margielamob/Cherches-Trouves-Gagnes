import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogDeleteAccountComponent } from '@app/components/dialog-delete-account/dialog-delete-account.component';
import { AuthenticationService } from '@app/services/authentication-service/authentication.service';
import { take } from 'rxjs';

@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent {
    constructor(private router: Router, private auth: AuthenticationService, private dialog: MatDialog) {}

    deleteAccount() {
        const dialogRef = this.dialog.open(DialogDeleteAccountComponent);

        dialogRef.afterClosed().subscribe((wantsToDelete) => {
            if (wantsToDelete) {
                // Appelez votre méthode pour supprimer le compte ici
                this.deleteFirebaseUser();
            }
        });
    }

    deleteFirebaseUser() {
        this.auth
            .deleteAccount()
            .pipe(take(1))
            .subscribe(() => {
                this.router.navigate(['/login']);
            });
    }
}
