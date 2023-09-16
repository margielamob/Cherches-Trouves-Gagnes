import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ImageUploadService {
    constructor(private storage: AngularFireStorage) {}

    uploadImage(image: File, uid: string) {
        // eslint-disable-next-line no-console
        console.log('upload image');
        const task = this.storage.upload(`avatars/${uid}/avatar.jpg`, image);
        return task.snapshotChanges();
    }

    getImageUrl(uid: string): Observable<string> {
        return this.storage.ref(`avatars/${uid}/avatar.jpg`).getDownloadURL();
    }
}
