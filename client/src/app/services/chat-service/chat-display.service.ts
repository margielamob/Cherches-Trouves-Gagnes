import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChatDisplayService {
    isRoomSelected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isSearchSelected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
}
