import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication-service/authentication.service";
import { Router } from "@angular/router";
<<<<<<< HEAD
import { take } from "rxjs";
import { UserService } from "../../services/user-service/user.service";
=======
import { catchError, take } from "rxjs";
>>>>>>> 6f85f1e16d126be7f14f55d1bc0c173b47d28185

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = "";
  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = new FormGroup({
      credential: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {
    this.userService.getUserByUserName("kevin").subscribe({
      next: (user) => {
        console.log("user", user);
      },
    });
  }
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
<<<<<<< HEAD
      .loginWithUserName(credential, password, isEmail)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigate(["home"]);
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        },
=======
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
>>>>>>> 6f85f1e16d126be7f14f55d1bc0c173b47d28185
      });
  }

  goToSignUpPage() {
    this.router.navigate(["/sign-up"]);
  }
}
