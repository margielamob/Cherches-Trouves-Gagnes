import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Theme } from '@app/enums/theme';
import { AdminService } from '@app/services/admin-service/admin.service';
import { ConfirmDeleteDialogComponent } from '@app/components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
    selector: 'app-admin-commands',
    templateUrl: './admin-commands.component.html',
    styleUrls: ['./admin-commands.component.scss'],
})
export class AdminCommandsComponent {
    favoriteTheme: string = Theme.ClassName;

    constructor(private readonly adminService: AdminService, private readonly matDialog: MatDialog) {}

    hasCards(): boolean {
        return this.adminService.hasCards();
    }

    onClickModifySettings(): void {
        this.adminService.openSettings();
    }

    onClickDeleteGames(): void {
        this.matDialog.open(ConfirmDeleteDialogComponent, { data: { singleGameDelete: false } });
    }

    onClickRefreshGames(): void {
        this.adminService.refreshAllGames();
    }
}
