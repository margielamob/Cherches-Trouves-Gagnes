import 'package:app/pages/admin_page.dart';
import 'package:app/pages/login_page.dart';
import 'package:app/pages/main_page.dart';
import 'package:app/pages/sign_up_page.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:app/domain/services/http_service.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/user_service.dart';
import 'package:app/domain/themes/default-theme.dart';
import 'package:provider/provider.dart';

void registerDependencies() {
  Get.put(UserService());
  Get.put(AuthService());
  Get.put(HttpService());
  Get.put(CarouselService());
}

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
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) {
          CarouselService carouselService = Get.find();
          return carouselService;
        })
        // Add more providers here
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
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
        '/signUpPage': (context) => SignUpPage(),
        '/adminPage': (context) => AdminPage(),
      },
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
