import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { User } from "@app/interfaces/user";
import { Observable, catchError, from, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) {}

  adduser(user: User) {
    return from(this.afs.collection("users").doc(user.uid).set(user));
  }

  isUserNameAvailable(userName: string): Observable<boolean> {
    return this.afs
      .collection("users", (ref) => ref.where("displayName", "==", userName))
      .get()
      .pipe(
        map((resut) => {
          if (!resut.empty) {
            return false;
          } else {
            return true;
          }
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
