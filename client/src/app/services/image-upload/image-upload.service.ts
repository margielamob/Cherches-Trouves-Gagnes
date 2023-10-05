import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, from, switchMap } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class ImageUploadService {
    constructor(private storage: AngularFireStorage) {}

    uploadImage(image: File, path: string): Observable<string> {
        const storageRef = this.storage.ref(path);
        const uploadTask = from(storageRef.put(image));
        return uploadTask.pipe(switchMap(() => storageRef.getDownloadURL()));
    }
}
