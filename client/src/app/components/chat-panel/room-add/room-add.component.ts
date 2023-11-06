import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatDisplayService } from '@app/services/chat-service/chat-display.service';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';
import { debounceTime, of, startWith, switchMap } from 'rxjs';

@Component({
    selector: 'app-room-add',
    templateUrl: './room-add.component.html',
    styleUrls: ['./room-add.component.scss'],
})
export class RoomAddComponent implements OnInit {
    unjoinedRooms: string[] = this.chatManager.allRoomsList.value.filter(
        (room: string) => room !== 'all' || !this.chatManager.userRoomList.value.includes(room),
    );
    selectedRooms: string[] = [];
    search = new FormControl();
    $search = this.search.valueChanges.pipe(
        startWith(null),
        debounceTime(200),
        switchMap((res: string) => {
            if (!res) return of(this.unjoinedRooms);
            res = res.toLowerCase();
            return of(this.unjoinedRooms.filter((x) => x.toLowerCase().indexOf(res) >= 0));
        }),
    );

    constructor(private chatManager: ChatManagerService, private chatDisplay: ChatDisplayService) {}

    ngOnInit(): void {
        this.chatManager.allRoomsList.subscribe((rooms) => {
            this.unjoinedRooms = rooms.filter((room) => !this.chatManager.userRoomList.value.includes(room));
        });
    }

    joinRooms() {
        this.chatManager.joinRooms(this.selectedRooms);
        this.chatDisplay.deselectSearch();
    }
}
