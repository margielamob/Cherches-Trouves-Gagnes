import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:app/domain/services/classic_game_service.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/end_game_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/services/http_service.dart';
import 'package:app/domain/services/image_decoder_service.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:app/domain/services/profile_page_manager.dart';
import 'package:app/domain/services/reachable_games_manager.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/services/sound_service.dart';
import 'package:app/domain/themes/default-theme.dart';
import 'package:app/pages/admin_page.dart';
import 'package:app/pages/camera_visualiser_page.dart';
import 'package:app/pages/chat_page.dart';
import 'package:app/pages/create_game.dart';
import 'package:app/pages/game_selection_page.dart';
import 'package:app/pages/login_page.dart';
import 'package:app/pages/main_page.dart';
import 'package:app/pages/profile_page.dart';
import 'package:app/pages/reachable_game_page.dart';
import 'package:app/pages/sign_up_page.dart';
import 'package:app/pages/waiting_page.dart';
import 'package:camera/camera.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

void registerDependencies() {
  Get.put(SoundService());
  Get.put(SocketService());
  Get.put(PersonalUserService());
  Get.put(AuthService());
  Get.put(HttpService());
  Get.put(DifferenceDetectionService());
  Get.put(ClassicGameService());
  Get.put(CarouselService());
  Get.put(ImageDecoderService());
  Get.put(ClassicGameService());
  Get.put(GameManagerService());
  Get.put(EndGameService());
  Get.put(ReachableGameManager());
  Get.put(ProfilePageManager());
  Get.put(ChatManagerService());
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
        ChangeNotifierProvider(
          create: (context) {
            CarouselService carouselService = Get.find();
            return carouselService;
          },
        ),
        ChangeNotifierProvider(
          create: (context) {
            GameManagerService gameManagerService = Get.find();
            return gameManagerService;
          },
        ),
        ChangeNotifierProvider(
          create: (context) {
            DifferenceDetectionService differenceDetectionService = Get.find();
            return differenceDetectionService;
          },
        ),
        ChangeNotifierProvider(
          create: (context) {
            EndGameService endGameService = Get.find();
            return endGameService;
          },
        ),
        ChangeNotifierProvider(
          create: (context) {
            ReachableGameManager reachableGameManager = Get.find();
            return reachableGameManager;
          },
        ),
        ChangeNotifierProvider(
          create: (context) {
            ProfilePageManager profilePageManager = Get.find();
            return profilePageManager;
          },
        ),
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final firstCamera = cameras.first;
    return GetMaterialApp(
      theme: appTheme,
      initialRoute: '/',
      debugShowCheckedModeBanner: false,
      routes: {
        '/': (context) => LoginPage(),
        '/gameSelection': (context) => GameSelectionPage(),
        '/create': (context) => CreateGamePage(),
        '/MainPage': (context) => MainPage(),
        '/loginPage': (context) => LoginPage(),
        '/signUpPage': (context) => SignUpPage(),
        '/adminPage': (context) => AdminPage(),
        '/ProfilePage': (context) => ProfilePage(),
        '/WaitingPage': (context) => WaitingPage(),
        '/ReachableGamePage': (context) => ReachableGamePage(),
        '/TakePictureScreen': (context) =>
            TakePictureScreen(camera: firstCamera),
        '/chatPage': (context) => ChatPage()
      },
    );
  }
}
