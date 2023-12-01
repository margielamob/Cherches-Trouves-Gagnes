import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChatDisplayService {
    isRoomSelected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isSearchSelected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isChatVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    selectRoom() {
        this.isRoomSelected.next(true);
    }
    selectSearch() {
        this.isSearchSelected.next(true);
    }
    deselectRoom() {
        this.isRoomSelected.next(false);
    }
    deselectSearch() {
        this.isSearchSelected.next(false);
    }
    toggleChat() {
        this.isChatVisible.next(!this.isChatVisible.value);
    }

    hideChat() {
        if (this.isChatVisible.value) {
            this.isChatVisible.next(false);
        }
    }

    reset() {
        this.isRoomSelected.next(false);
        this.isSearchSelected.next(false);
        this.isChatVisible.next(false);
    }
}
