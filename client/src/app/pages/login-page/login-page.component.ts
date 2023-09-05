import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication-service/authentication.service";
import { Router } from "@angular/router";
import { catchError, take } from "rxjs";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = "";
  constructor(private auth: AuthenticationService, private router: Router) {
    this.loginForm = new FormGroup({
      credential: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {}
  get credential() {
    return this.loginForm.get("credential");
  }

  get password() {
    return this.loginForm.get("password");
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }

    const { credential, password } = this.loginForm.value;
    const credentialValue: string = this.credential?.value;
    const isEmail: boolean = credentialValue.includes("@");

    console.log("isEmail", isEmail);

    this.auth
      .login(credential, password)
      .pipe(
        take(1),
        catchError(() => {
          // Message d'erreur à afficher
          this.errorMessage =
            "Une erreur s'est produite lors de la connexion. Verifier vos informations de connexion";
          throw new Error("Erreur de connexion");
        })
      )
      .subscribe(() => {
        this.router.navigate(["/home"]);
      });
  }

  goToSignUpPage() {
    this.router.navigate(["/sign-up"]);
  }
}
