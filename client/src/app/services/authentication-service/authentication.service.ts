import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { from } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(private afAuth: AngularFireAuth) {}

  login(email: string, password: string) {
    // login user with email and password
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  logout() {
    //logout currunt user . A utuliser plus tard
    return from(this.afAuth.signOut());
  }
}
