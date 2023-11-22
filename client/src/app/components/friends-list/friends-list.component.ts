import { Component } from '@angular/core';
import { UserData } from '@app/interfaces/user';
import { UserService } from '@app/services/user-service/user.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-friends-list',
    templateUrl: './friends-list.component.html',
    styleUrls: ['./friends-list.component.scss'],
})
export class FriendsListComponent {
    currentUserId = this.userService.activeUser.uid;
    friends$: Observable<UserData[]>; // Remplacez par le type approprié pour vos données d'amis

    constructor(private userService: UserService) {
        this.friends$ = this.userService.getFriends();
    }

    removeFriend(friendUid: string) {
        // La suppression est gérée par votre service UserService
        this.userService.deleteFriend(this.currentUserId, friendUid).subscribe({
            next: () => {
                console.log('Ami supprimé avec succès');
            },
            error: (error) => console.error("Erreur lors de la suppression de l'ami:", error),
        });
    }
}
