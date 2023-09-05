import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { User } from "@app/interfaces/user";
import { catchError, from } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private afs: AngularFirestore) {}

  adduser(user: User) {
    console.log("here");
    return from(this.afs.collection("users").doc(user.uid).set(user)).pipe(
      catchError((error) => {
        console.error("sign-up error ", error);
        throw error;
      })
    );
  }
}
