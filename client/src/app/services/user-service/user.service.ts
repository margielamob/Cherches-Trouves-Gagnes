import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { User } from "@app/interfaces/user";
import { Observable, from, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private afs: AngularFirestore) {}

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
}
