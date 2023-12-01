import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DialogUserAvatarComponent } from '@app/components/dialog-user-avatar/dialog-user-avatar.component';
import { LanguageCode, languageCodeMap } from '@app/enums/lang';
import { Theme } from '@app/enums/theme';
import { UserData } from '@app/interfaces/user';
import { LanguageService } from '@app/services/language-service/languag.service';
import { UserService } from '@app/services/user-service/user.service';

import { DialogChangeNameComponent } from '@app/components/dialog-change-name/dialog-change-name.component';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';
import { ThemeService } from '@app/services/theme-service/theme.service';
import { Observable, switchMap, take } from 'rxjs';

@Component({
    selector: 'app-user-profil-information',
    templateUrl: './user-profil-information.component.html',
    styleUrls: ['./user-profil-information.component.scss'],
})
export class UserProfilInformationComponent implements OnInit {
    currentUserId: string | undefined;
    userAvatar: string | undefined;
    userLang: string | undefined;
    user$: Observable<UserData | undefined>;
    languages = Object.values(LanguageCode);
    themes = Object.keys(Theme);
    settingsForm: FormGroup;
    curruntLanguage: string | undefined = 'Fr';
    curruntTheme: string = '';

    // eslint-disable-next-line max-params
    constructor(
        private userService: UserService,
        private dialog: MatDialog,
        private langService: LanguageService,
        private themeService: ThemeService,
        private chatManager: ChatManagerService,
    ) {
        this.settingsForm = new FormGroup({
            theme: new FormControl('', [Validators.required]),
            language: new FormControl('', [Validators.required]),
        });
    }

    get language() {
        return this.settingsForm.get('language');
    }

    get theme() {
        return this.settingsForm.get('theme');
    }

    ngOnInit(): void {
        this.user$ = this.userService.getCurrentUser();
        this.user$.subscribe((user) => {
            this.currentUserId = user?.uid;
            this.setUserAvatar(user);
        });

        this.userService.getUserLang().subscribe((lang) => {
            const langValue = lang || 'Fr';
            this.curruntLanguage = langValue === 'Fr' ? 'Français' : 'English';
            this.langService.setCurrentLanguage(langValue as string);
            this.settingsForm.controls.language.setValue(this.curruntLanguage);
        });

        this.userService.getUserTheme().subscribe((theme) => {
            const themeValue = theme || 'Default';
            this.curruntTheme = themeValue as string;
            this.settingsForm.controls.theme.setValue(this.curruntTheme);
            this.langService.setCurrentLanguage(themeValue as string);
        });
    }

    setUserAvatar(user: UserData | undefined) {
        if (this.currentUserId === undefined) return;
        if (user?.photoURL === '') {
            this.userAvatar = 'assets/default-user-icon.jpg';
        } else if (user?.photoURL === `avatars/${this.currentUserId}/avatar.jpg`) {
            this.userService.getImageOfSignedUser(user?.photoURL).subscribe((url) => {
                if (url) {
                    this.userAvatar = url;
                }
            });
        } else {
            this.userAvatar = user?.photoURL ?? 'assets/default-user-icon.jpg';
        }
    }

    openUserAvatarDialog(): void {
        this.dialog.open(DialogUserAvatarComponent, {
            autoFocus: false,
            width: '70vw',
            height: '50vh',
            data: {
                adding: false,
                currentUserId: this.currentUserId,
            },
        });
    }

    openNameDialog(): void {
        this.dialog.open(DialogChangeNameComponent, {
            width: '350px',
        });
    }

    onLanguageChange(event: MatSelectChange) {
        const lang = languageCodeMap.get(event.value) as string;

        this.userService
            .setUserLang(lang)
            .pipe(switchMap(() => this.userService.getUserLang().pipe(take(1))))
            .subscribe((userLang) => {
                if (userLang) {
                    this.curruntLanguage = userLang;
                    this.langService.setAppLanguage(userLang as string);
                    this.chatManager.updateDetachedLanguage(userLang as string);
                }
            });
    }

    onThemeChange(event: MatSelectChange) {
        const selectedTheme = event.value;

        this.userService
            .setUserTheme(selectedTheme)
            .pipe(switchMap(() => this.userService.getUserTheme().pipe(take(1))))
            .subscribe((userTheme) => {
                if (userTheme) {
                    this.curruntTheme = userTheme;
                }
                this.themeService.setAppTheme(userTheme as string);
                this.chatManager.updateDetachedTheme(userTheme as string);
            });
    }
}
