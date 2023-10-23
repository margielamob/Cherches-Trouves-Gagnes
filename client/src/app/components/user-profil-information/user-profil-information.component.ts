import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DialogUserAvatarComponent } from '@app/components/dialog-user-avatar/dialog-user-avatar.component';
import { LanguageCode, languageCodeMap } from '@app/enums/lang';
import { UserData } from '@app/interfaces/user';
import { LanguageService } from '@app/services/language-service/language-service.service';
import { UserService } from '@app/services/user-service/user.service';

import { Observable } from 'rxjs';

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
    settingsForm: FormGroup;
    curruntLanguage: string | undefined = 'Fr';

    constructor(private userService: UserService, private dialog: MatDialog, private langService: LanguageService) {
        this.settingsForm = new FormGroup({
            language: new FormControl('', [Validators.required]),
        });
    }

    get language() {
        return this.settingsForm.get('language');
    }

    ngOnInit(): void {
        this.user$ = this.userService.getCurrentUser();
        this.user$.subscribe((user) => {
            this.currentUserId = user?.uid;
            this.setUserAvatar(user);
        });

        this.userService.getUserLang().subscribe((lang) => {
            this.curruntLanguage = lang === 'Fr' ? 'Français' : 'English';
            this.settingsForm.controls.language.setValue(this.curruntLanguage);
        });

        console.log('Langue sélectionnée settings :', this.curruntLanguage);
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

    onLanguageChange(event: MatSelectChange) {
        const lang = languageCodeMap.get(event.value) as string;
        console.log('Langue sélectionnée :', lang);
        this.langService.setlanguage(lang);
        console.log('Langue sélectionnée settings :', this.langService.currunetLanguage);
    }

    saveChanges() {
        // change user language on firebase
    }
}
