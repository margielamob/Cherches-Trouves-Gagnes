import 'package:app/components/camera.dart';
import 'package:app/domain/services/auth-service.dart';
import 'package:app/domain/services/card-feed-service.dart';
import 'package:app/domain/services/http-client-service.dart';
import 'package:app/domain/services/user-service.dart';
import 'package:app/domain/themes/default-theme.dart';
import 'package:app/pages/admin-page.dart';
import 'package:app/pages/profile-page.dart';
import 'package:camera/camera.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

void registerDependencies() {
  Get.put(UserService());
  Get.put(AuthService());
  Get.put(HttpClientService());
  Get.put(CardFeedService());
}

late List<CameraDescription> cameras;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
      options: FirebaseOptions(
    apiKey: 'AIzaSyBjEIQq8dWQQQlOuS4ZpZ0C1wYGzAjKVEE',
    appId: '1:277200615128:android:98ad49c71400eb7d8889ad',
    messagingSenderId: '277200615128',
    projectId: 'log3900-103-f3850',
    storageBucket: 'log3900-103-f3850.appspot.com',
  ));
  registerDependencies();
  cameras = await availableCameras();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final firstCamera = cameras.first;
    return MaterialApp(
      theme: appTheme,
      initialRoute: '/',
      debugShowCheckedModeBanner: false,
      routes: {
        '/': (context) => LoginPage(),
        '/pageA': (context) => PageA(),
        '/pageB': (context) => PageB(),
        '/MainPage': (context) => MainPage(),
        '/loginPage': (context) => LoginPage(),
        '/signupPage': (context) => SignUpPage(),
        '/adminPage': (context) => AdminPage(),
        '/ProfilePage': (context) => ProfilePage(),
        '/TakePictureScreen': (context) =>
            TakePictureScreen(camera: firstCamera),
      },
    );
  }
}

class MainPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  children: [
                    Padding(
                      padding: EdgeInsets.fromLTRB(0, 25, 60, 0),
                      child: Row(
                        children: [
                          Text(
                            'Jeux de différences',
                            style: TextStyle(
                                fontSize: 35, fontWeight: FontWeight.bold),
                          ),
                          SizedBox(width: 20),
                          Image.asset(
                            'logoJdD.png',
                            width: 100,
                            height: 100,
                          ),
                        ],
                      ),
                    ),
                    SizedBox(height: 70),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/pageA');
                      },
                      child: Text('Go to Page A'),
                    ),
                    SizedBox(height: 50),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/pageB');
                      },
                      child: Text('Go to admin'),
                    ),
                    SizedBox(height: 100),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/ProfilePage');
                      },
                      child: Text('Go to Profile Page'),
                    ),
                    SizedBox(height: 50),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/pageD');
                      },
                      child: Text('Go to Page D'),
                    ),
                    SizedBox(height: 30),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          'Équipe 103:',
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        Padding(
                            padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                            child: Text(
                              'Thierry, Ahmed El, Ahmed Ben, Skander, Samy',
                              style: TextStyle(
                                  fontSize: 15, fontWeight: FontWeight.w400),
                            ))
                      ],
                    )
                  ],
                ),
                Column(
                  children: [
                    Row(
                      children: [
                        Image.asset(
                          'quote.png',
                          width: 500,
                          height: 800,
                        ),
                      ],
                    )
                  ],
                )
              ],
            )
          ],
        ),
      ),
    );
  }
}

class PageA extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Page A'),
      ),
      body: Center(
        child: Text(
          'This is Page A',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}

class PageB extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Page B'),
      ),
      body: Center(
        child: Text(
          'This is Page B',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}

//signup page

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
  final UserService userService = Get.find();
  final AuthService authService = Get.find();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Inscription"),
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

                              try {
                                final firebaseCredential =
                                    await authService.signUp(email as String,
                                        password as String, userName as String);

                                UserData user = UserData(
                                  uid: firebaseCredential.user!.uid,
                                  displayName: userName as String,
                                  email: email as String,
                                  photoURL: '',
                                  phoneNumber: '',
                                  theme: '',
                                  language: '',
                                  gameLost: 0,
                                  gameWins: 0,
                                  gamePlayed: 0,
                                  averageTime: '',
                                );

                                await userService.addUser(user);
                                print('User added');
                                _formKey.currentState!.reset();
                                Navigator.pushNamed(context, '/loginPage');
                              } catch (error) {
                                print(error);
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
                  'quote.png',
                  fit: BoxFit.cover,
                ),
              ),
            ],
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
                        buildTextField("Adresse e-mail", (value) {
                          if (value == null || value.isEmpty) {
                            return "Veuillez entrer votre adresse e-mail ou nom d'utilisateur.";
                          }
                          if (value.contains('@')) {
                            isEmail = true;
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
                              try {
                                await authService.signInWithUserName(
                                    credential as String,
                                    password as String,
                                    isEmail);
                                _formKey.currentState!.reset();

                                Navigator.pushNamed(context, '/MainPage');
                              } catch (error) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Error: $error')),
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
                  'quote.png',
                  fit: BoxFit.cover,
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
