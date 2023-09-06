import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { User } from "@app/interfaces/user";
import { catchError, from } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) {}

  adduser(user: User) {
    console.log("here");
    return from(this.afs.collection("users").doc(user.uid).set(user)).pipe(
      catchError((error) => {
        console.error("sign-up error ", error);
        throw error;
      })
    );
  }

  updateUser(user: User) {
    return from( this.afs.collection("users").doc(user.uid).update(user)).pipe(
      catchError((error) => {
        console.error("update user error ", error);
        throw error;
      }
    ));
  }

  getImageOfSignedUser(uid: string) {
    return this.storage.ref(`avatars/${uid}`).getDownloadURL().pipe(
      catchError((error) => {
        console.error("get image error ", error);
        throw error;
      })
    );
  }

}
