import 'package:app/domain/models/replay_bar_model.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:app/domain/services/classic_game_service.dart';
import 'package:app/domain/services/clock_service.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/end_game_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/services/game_replay_service.dart';
import 'package:app/domain/services/http_service.dart';
import 'package:app/domain/services/image_decoder_service.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:app/domain/services/profile_page_manager.dart';
import 'package:app/domain/services/reachable_games_manager.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/services/sound_service.dart';
import 'package:app/domain/services/time_formatter_service.dart';
import 'package:app/domain/themes/theme_constantes.dart';
import 'package:app/pages/admin_page.dart';
import 'package:app/pages/camera_visualiser_page.dart';
import 'package:app/pages/create_game.dart';
import 'package:app/pages/game_selection_page.dart';
import 'package:app/pages/login_page.dart';
import 'package:app/pages/main_page.dart';
import 'package:app/pages/profile_page.dart';
import 'package:app/pages/reachable_game_page.dart';
import 'package:app/pages/reset_password_page.dart';
import 'package:app/pages/sign_up_page.dart';
import 'package:app/pages/waiting_page.dart';
import 'package:camera/camera.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

void registerDependencies() {
  Get.put(SoundService());
  Get.put(SocketService());
  Get.put(TimeFormatterService());
  Get.put(ClockService());
  Get.put(PersonalUserService());
  Get.put(AuthService());
  Get.put(HttpService());
  Get.put(ClassicGameService());
  Get.put(CarouselService());
  Get.put(ImageDecoderService());
  Get.put(ClassicGameService());
  Get.put(ReplayBar());
  Get.put(GameManagerService());
  Get.put(DifferenceDetectionService());
  Get.put(GameReplayService());
  Get.put(EndGameService());
  Get.put(ReachableGameManager());
  Get.put(ProfilePageManager());
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
            ClockService clockService = Get.find();
            return clockService;
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
        ChangeNotifierProvider(
          create: (context) {
            GameReplayService gameReplayService = Get.find();
            return gameReplayService;
          },
        ),
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  final AuthService authService = Get.find();
  @override
  Widget build(BuildContext context) {
    // listen to changes in the auth state
    return StreamBuilder<User?>(
      stream: authService.auth.authStateChanges(),
      builder: (context, snapshot) {
        // if the connection is active and the user is not null
        if (snapshot.connectionState == ConnectionState.active &&
            snapshot.data != null) {
          // user is logged in, use the user's theme
          return Consumer<ProfilePageManager>(
            builder: (context, profileManager, child) {
              // ProfileManager listen to changes in the theme
              return buildGetMaterialApp(context, profileManager.getTheme());
            },
          );
        } else {
          // user is not logged in , use the default theme
          return buildGetMaterialApp(context, DefaultTheme);
        }
      },
    );
  }

  GetMaterialApp buildGetMaterialApp(BuildContext context, ThemeData theme) {
    final firstCamera = cameras.first;

    return GetMaterialApp(
      theme: theme,
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
        '/ReserPasswordPage': (context) => ResetPasswordPage(),
      },
    );
  }
}
