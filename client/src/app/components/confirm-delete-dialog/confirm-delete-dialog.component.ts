import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Theme } from '@app/enums/theme';
import { AdminService } from '@app/services/admin-service/admin.service';

@Component({
    selector: 'app-confirm-delete-dialog',
    templateUrl: './confirm-delete-dialog.component.html',
    styleUrls: ['./confirm-delete-dialog.component.scss'],
})
export class ConfirmDeleteDialogComponent {
    theme: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: { gameId: string; singleGameDelete: boolean }, private readonly adminService: AdminService) {
        this.theme = Theme.ClassName;
    }

    deleteAllGames(): void {
        this.adminService.deleteAllGames();
    }

    deleteSingleGame(): void {
        this.adminService.deleteSingleGame(this.data.gameId);
    }
}
