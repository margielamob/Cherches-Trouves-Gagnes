import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ImageUploadService {
    constructor(private storage: AngularFireStorage, private http: HttpClient) {}

    uploadImage(image: File, uid: string) {
        // eslint-disable-next-line no-console
        console.log('upload image');
        return this.storage.upload(`avatars/${uid}/avatar.jpg`, image);
    }

    getAvatarFileNames(): Observable<string[]> {
        // Adjust the path to match your assets folder structure
        const folderPath = 'assets/avatar-predifini/';
        return this.http.get(folderPath, { responseType: 'text' }).pipe(
            map((data) => {
                // Split the response into an array of file names
                const fileNames = data.split('\n').map((fileName) => fileName.trim());
                return fileNames;
            }),
        );
    }
}
