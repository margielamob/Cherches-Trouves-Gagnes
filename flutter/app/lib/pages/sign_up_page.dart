import 'package:app/domain/models/user_data.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:app/pages/login_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SignUpPage extends StatefulWidget {
  SignUpPage({
    Key? key,
  }) : super(key: key);

  @override
  State<SignUpPage> createState() => SignUpPageState();
}

class SignUpPageState extends State<SignUpPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  String? email = "";
  String? userName = "";
  String? password = "";
  final AuthService authService = Get.find();
  final PersonalUserService userService = Get.find();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Inscription"),
      ),
      body: WillPopScope(
        onWillPop: () async => false,
        child: SingleChildScrollView(
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
                            "Inscription",
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 40),
                          buildTextField("Adresse e-mail", (value) {
                            if (value == null || value.isEmpty) {
                              return "Veuillez entrer votre adresse e-mail ou nom d'utilisateur.";
                            }
                            if (!isValidEmail(value)) {
                              return "Veuillez entrer une adresse e-mail valide.";
                            }
                            return null;
                          }, (value) => email = value),
                          SizedBox(height: 30),
                          buildTextField("Nom d'utilisateur", (value) {
                            if (value == null || value.isEmpty) {
                              return "Veuillez entrer un nom d'utilisateur.";
                            }
                            if (value.contains('@') || value.contains(' ')) {
                              return "Le nom d'utilisateur ne doit pas contenir d'espaces ou de caractères spéciaux.";
                            }
                            return null;
                          }, (value) => userName = value),
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
                                bool isAvailable = await userService
                                    .isUserNameAvailable(userName as String);

                                if (!isAvailable) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(
                                          'Ce nom d\'utilisateur est déjà pris.'),
                                      backgroundColor: Colors.red,
                                    ),
                                  );
                                  return;
                                } else {
                                  try {
                                    final firebaseCredential =
                                        await authService.signUp(
                                            email as String,
                                            password as String,
                                            userName as String);

                                    UserData user = UserData(
                                      uid: firebaseCredential.user!.uid,
                                      displayName: userName as String,
                                      email: email as String,
                                      photoURL: 'assets/default-user-icon.jpg',
                                      phoneNumber: '',
                                      theme: 'Default',
                                      language: 'Fr',
                                      gameWins: 0,
                                      numberDifferenceFound: 0,
                                      totalTimePlayed: 0,
                                      gamePlayed: 0,
                                    );

                                    await userService.addUser(user);
                                    _formKey.currentState!.reset();
                                    Get.offAll(LoginPage());
                                  } catch (error) {
                                    print(error);
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text('$error'),
                                        backgroundColor: Colors.red,
                                      ),
                                    );
                                  }
                                }
                              }
                            },
                            child: Text("S'inscrire"),
                          ),
                          SizedBox(height: 20),
                          TextButton(
                            onPressed: () {
                              Navigator.pushNamed(context, '/loginPage');
                            },
                            child: Text("Deja Inscris? Connectez-vous"),
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
                    'assets/quote_d.png',
                    width: 600,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

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

  bool isValidEmail(String email) {
    final RegExp emailRegex =
        RegExp(r'^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$');
    return emailRegex.hasMatch(email);
  }
}
