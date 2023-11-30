import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';
import { UserService } from '@app/services/user-service/user.service';
import { userNameValidator } from 'utils/custom-validators';

@Component({
    selector: 'app-dialog-change-name',
    templateUrl: './dialog-change-name.component.html',
    styleUrls: ['./dialog-change-name.component.scss'],
})
export class DialogChangeNameComponent {
    changeUserNameForm: FormGroup;
    displayName: string;

    constructor(
        private userService: UserService,
        public dialogRef: MatDialogRef<DialogChangeNameComponent>,
        private chatManager: ChatManagerService,
    ) {
        this.changeUserNameForm = new FormGroup({
            username: new FormControl(
                '',
                [Validators.required, Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$')],
                [userNameValidator(this.userService)],
            ),
        });
    }

    get username() {
        return this.changeUserNameForm.get('username');
    }
    onSubmit() {
        if (this.changeUserNameForm.valid) {
            const oldDisplayName = this.userService.activeUser.displayName;
            const newDisplayName = this.changeUserNameForm.get('username')?.value;
            this.userService.changeUserDisplayName(newDisplayName).subscribe({
                next: () => {
                    this.chatManager.updateMessagesUsername(oldDisplayName, newDisplayName);
                    this.dialogRef.close();
                },
                error: (error) => {
                    throw error;
                },
            });
        }
    }
}
