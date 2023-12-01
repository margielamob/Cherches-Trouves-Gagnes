import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatDisplayService } from '@app/services/chat-service/chat-display.service';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';
import { ThemeService } from '@app/services/theme-service/theme.service';
import { debounceTime, of, startWith, switchMap } from 'rxjs';

const time = 200;

@Component({
    selector: 'app-room-add',
    templateUrl: './room-add.component.html',
    styleUrls: ['./room-add.component.scss'],
})
export class RoomAddComponent implements OnInit {
    unjoinedRooms: string[] = [];
    selectedRooms: string[] = [];
    search = new FormControl();
    $search = this.search.valueChanges.pipe(
        startWith(null),
        debounceTime(time),
        switchMap((res: string) => {
            if (!res) return of(this.unjoinedRooms);
            res = res.toLowerCase();
            return of(this.unjoinedRooms.filter((x) => x.toLowerCase().indexOf(res) >= 0));
        }),
    );

    constructor(private chatManager: ChatManagerService, private chatDisplay: ChatDisplayService, public themeService: ThemeService) {}

    ngOnInit(): void {
        this.chatManager.allRoomsList.subscribe((rooms) => {
            const userRoomNames: string[] = this.chatManager.userRoomList.value.map((e) => e.room);
            // console.log(userRoomNames);
            this.unjoinedRooms = rooms.filter((room) => room !== 'all' && !userRoomNames.includes(room));
            // console.log(this.unjoinedRooms);
        });
    }

    selectRoom(room: string) {
        if (this.selectedRooms.includes(room)) {
            this.selectedRooms = this.selectedRooms.filter((x) => x !== room);
        } else {
            this.selectedRooms.push(room);
        }
    }
    joinRooms() {
        this.chatManager.joinRooms(this.selectedRooms);
        this.chatDisplay.deselectSearch();
    }
}
