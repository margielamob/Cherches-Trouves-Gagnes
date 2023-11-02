import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:app/domain/services/classic_game_service.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/http_service.dart';
import 'package:app/domain/services/image_decoder_service.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/services/sound_service.dart';
import 'package:app/domain/services/user_service.dart';
import 'package:app/domain/themes/default-theme.dart';
import 'package:app/pages/admin_page.dart';
import 'package:app/pages/camera_visualiser_page.dart';
import 'package:app/pages/classic_game_page.dart';
import 'package:app/pages/create_game.dart';
import 'package:app/pages/game_selection_page.dart';
import 'package:app/pages/login_page.dart';
import 'package:app/pages/main_page.dart';
import 'package:app/pages/profile_page.dart';
import 'package:app/pages/sign_up_page.dart';
import 'package:camera/camera.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

void registerDependencies() {
  Get.put(SocketService());
  Get.put(UserService());
  Get.put(AuthService());
  Get.put(HttpService());
  Get.put(DifferenceDetectionService());
  Get.put(ClassicGameService());
  Get.put(CarouselService());
  Get.put(ImageDecoderService());
  Get.put(ClassicGameService());
  Get.put(SoundService());
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
    final firstCamera = cameras.first;
    return MaterialApp(
      theme: appTheme,
      initialRoute: '/',
      debugShowCheckedModeBanner: false,
      routes: {
        '/': (context) => LoginPage(),
        '/classic': (context) => Classic(
            bmpOriginalId: "b72c2106-f4f1-4a34-9797-f795ce24e1dd",
            bmpModifiedId: "0f811652-a757-48d1-b348-51b5db40c9ee"),
        '/gameSelection': (context) => GameSelectionPage(),
        '/create': (context) => CreateGamePage(),
        '/MainPage': (context) => MainPage(),
        '/loginPage': (context) => LoginPage(),
        '/signUpPage': (context) => SignUpPage(),
        '/adminPage': (context) => AdminPage(),
        '/ProfilePage': (context) => ProfilePage(),
        '/TakePictureScreen': (context) =>
            TakePictureScreen(camera: firstCamera),
      },
    );
  }
}
