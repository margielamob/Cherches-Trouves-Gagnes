import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
    providedIn: 'root',
})
export class ImageUploadService {
    constructor(private storage: AngularFireStorage) {}

    uploadImage(image: File, uid: string) {
        return this.storage.upload(`avatars/${uid}`, image);
    }
}
