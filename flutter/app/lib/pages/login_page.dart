import 'package:app/domain/services/auth_service.dart';
import 'package:flutter/material.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  State<LoginPage> createState() => LoginPageState();
}

//login page

class LoginPageState extends State<LoginPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  String? credential = "";
  String? password = "";
  bool isEmail = false;
  final AuthService authService = AuthService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Connexion"),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Form on the left
              Expanded(
                flex: 5,
                child: Container(
                  padding: EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.5),
                        spreadRadius: 5,
                        blurRadius: 7,
                        offset: Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: <Widget>[
                        Text(
                          "Connectez-vous",
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 40),
                        buildTextField("Adresse e-mail ou nom d'utilisateur",
                            (value) {
                          if (value == null || value.isEmpty) {
                            return "Veuillez entrer votre adresse e-mail ou nom d'utilisateur.";
                          }
                          return null;
                        }, (value) => credential = value),
                        SizedBox(height: 30),
                        buildTextField("Mot de passe", (value) {
                          if (value == null || value.isEmpty) {
                            return "Veuillez entrer votre mot de passe.";
                          }
                          return null;
                        }, (value) => password = value, isPassword: true),
                        SizedBox(height: 40),
                        ElevatedButton(
                          onPressed: () async {
                            if (_formKey.currentState!.validate()) {
                              _formKey.currentState!.save();
                              isEmail = credential!.contains('@');

                              try {
                                await authService.signInWithUserName(
                                    credential as String,
                                    password as String,
                                    isEmail);
                                _formKey.currentState!.reset();

                                Navigator.pushNamed(context, '/MainPage');
                              } catch (error) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('$error'),
                                    backgroundColor: Colors.red,
                                  ),
                                );
                              }
                            }
                          },
                          child: Text("Se connecter"),
                        ),
                        SizedBox(height: 20),
                        TextButton(
                          onPressed: () {
                            Navigator.pushNamed(context, '/signupPage');
                          },
                          child: Text("Pas de compte? Inscrivez-vous"),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              SizedBox(width: 40),
              Expanded(
                flex: 4,
                child: Image.asset(
                  'assets/quote.png',
                  height: 600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // textFieldBuilder for forms

  Widget buildTextField(String labelText, String? Function(String?) validator,
      void Function(String?) onSaved,
      {bool isPassword = false}) {
    return TextFormField(
      decoration: InputDecoration(
        labelText: labelText,
      ),
      validator: validator,
      onSaved: onSaved,
      obscureText: isPassword,
    );
  }
}