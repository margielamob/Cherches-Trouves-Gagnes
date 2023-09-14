import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LanguageCode } from '@app/enums/lang';
import { UserData } from '@app/interfaces/user';
import { UserService } from '@app/services/user-service/user.service';
import { Observable, take } from 'rxjs';
import { userNameValidator } from 'utils/custom-validators';

@Component({
    selector: 'app-account-settings',
    templateUrl: './account-settings.component.html',
    styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {
    user$: Observable<UserData | undefined>;

    languages = Object.values(LanguageCode);

    settingsForm: FormGroup;

    constructor(private userService: UserService) {
        this.settingsForm = new FormGroup({
            username: new FormControl(
                '',
                [Validators.required, Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$')],
                [userNameValidator(this.userService)],
            ),
            language: new FormControl('', [Validators.required]),
            theme: new FormControl('', Validators.required),
        });
    }

    ngOnInit() {
        this.user$ = this.userService.getCurrentUser();
        this.user$.pipe(take(1)).subscribe((user) => {
            this.settingsForm.patchValue({
                username: user?.displayName,
                language: LanguageCode[user?.language as keyof typeof LanguageCode],
                theme: user?.theme,
            });
        });
    }
}
