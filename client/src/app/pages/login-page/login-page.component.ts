import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  constructor() {
    this.loginForm = new FormGroup({
      emailAdress: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {}
  get emailAdress() {
    return this.loginForm.get("emailAdress");
  }

  get password() {
    return this.loginForm.get("password");
  }

  submit() {
    // if (!this.loginForm.valid) {
    //   return;
    // }
    // const { emailAdress, password } = this.loginForm.value;
    // console.log(this.loginForm.value);
    // this.auth.login(emailAdress, password).subscribe(() => {
    //   console.log("home");
    //   this.route.navigate(["/home"]);
    // });
  }
}
