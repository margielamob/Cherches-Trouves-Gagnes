import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "@app/services/authentication-service/authentication.service";
import { UserService } from "@app/services/user-service/user.service";
import { take, tap } from "rxjs";
import { User } from "@app/interfaces/user";
import { Theme } from "@app/enums/theme";

@Component({
  selector: "app-sign-up-page",
  templateUrl: "./sign-up-page.component.html",
  styleUrls: ["./sign-up-page.component.scss"],
})
export class SignUpPageComponent implements OnInit {
  signUpForm: FormGroup;
  errorMessage: string = "";
  constructor(
    private router: Router,
    private userService: UserService,
    private auth: AuthenticationService
  ) {
    this.signUpForm = new FormGroup({
      username: new FormControl("", [
        Validators.required,
        Validators.pattern("^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$"),
      ]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {}

  get email() {
    return this.signUpForm.get("email");
  }

  get password() {
    return this.signUpForm.get("password");
  }

  get username() {
    return this.signUpForm.get("username");
  }

  goToLoginPage() {
    this.router.navigate(["/login"]);
  }

  submit() {
    if (!this.signUpForm.valid) {
      return;
    }
    const { username, email, password } = this.signUpForm.value;
    console.log();
    this.auth
      .signUp(email, password)
      .pipe(
        tap((credential) => {
          const user: User = {
            displayName: username as string,
            email: credential.user?.email as string,
            emailVerified: credential.user?.emailVerified,
            photoURL: "",
            uid: credential.user?.uid as string,
            phoneNumber: "",
            // Set default user configurations
            Theme: Theme.default,
            Language: "Fr",
            game_lost: 0,
            game_wins: 0,
            game_played: 0,
            average_time: "0:0",
          };
          this.userService.adduser(user);
        })
      )
      .pipe(take(1))
      .subscribe();
  }
}
