import 'package:app/domain/models/replay_bar_model.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:app/domain/services/chat_display_service.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:app/domain/services/classic_game_service.dart';
import 'package:app/domain/services/clock_service.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/difference_generator_service.dart';
import 'package:app/domain/services/drawing_service_left.dart';
import 'package:app/domain/services/drawing_service_right.dart';
import 'package:app/domain/services/end_game_service.dart';
import 'package:app/domain/services/friends_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/services/game_replay_service.dart';
import 'package:app/domain/services/generate_difference_slider_service.dart';
import 'package:app/domain/services/global_variables.dart';
import 'package:app/domain/services/http_service.dart';
import 'package:app/domain/services/image_decoder_service.dart';
import 'package:app/domain/services/image_selection_service.dart';
import 'package:app/domain/services/observable_game_manager.dart';
import 'package:app/domain/services/pencil_box_manager.dart';
import 'package:app/domain/services/pencil_service.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:app/domain/services/profile_page_manager.dart';
import 'package:app/domain/services/radius_slider_service.dart';
import 'package:app/domain/services/reachable_games_manager.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/services/sound_service.dart';
import 'package:app/domain/services/time_formatter_service.dart';
import 'package:app/domain/services/userListe.dart';
import 'package:app/domain/services/vignette_submission_service.dart';
import 'package:app/domain/themes/theme_constantes.dart';
import 'package:app/pages/admin_page.dart';
import 'package:app/pages/camera_visualiser_page.dart';
import 'package:app/pages/chat_page.dart';
import 'package:app/pages/create_game_page.dart';
import 'package:app/pages/friend-req.dart';
import 'package:app/pages/friendsListPage.dart';
import 'package:app/pages/game_selection_page.dart';
import 'package:app/pages/historic_page.dart';
import 'package:app/pages/login_page.dart';
import 'package:app/pages/main_page.dart';
import 'package:app/pages/observableGamePage.dart';
import 'package:app/pages/profile_page.dart';
import 'package:app/pages/reachable_game_page.dart';
import 'package:app/pages/reset_password_page.dart';
import 'package:app/pages/sign_up_page.dart';
import 'package:app/pages/social_page.dart';
import 'package:app/pages/waiting_page.dart';
import 'package:camera/camera.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

void registerDependencies() {
  Get.put(GlobalVariables());
  Get.put(ImageSelectionService());
  Get.put(SoundService());
  Get.put(SocketService());
  Get.put(TimeFormatterService());
  Get.put(ClockService());
  Get.put(PersonalUserService());
  Get.put(AuthService());
  Get.put(RadiusSliderService());
  Get.put(GenerateDifferenceSliderService());
  Get.put(PencilService());
  Get.put(DrawingServiceLeft());
  Get.put(DrawingServiceRight());
  Get.put(DifferenceGeneratorService());
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
  Get.put(ObservableGameManager());
  Get.put(ProfilePageManager());
  Get.put(ChatManagerService());
  Get.put(ChatDisplayService());
  Get.put(VignetteSubmissionService());
  Get.put(PencilBoxManager());
  Get.put(FriendRequestService());
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
            ObservableGameManager observableGameManager = Get.find();
            return observableGameManager;
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
        ChangeNotifierProvider(
          create: (context) {
            DrawingServiceRight drawingServiceRight = Get.find();
            return drawingServiceRight;
          },
        ),
        ChangeNotifierProvider(
          create: (context) {
            DrawingServiceLeft drawingServiceLeft = Get.find();
            return drawingServiceLeft;
          },
        ),
        ChangeNotifierProvider(
          create: (context) {
            VignetteSubmissionService vignetteSubmissionService = Get.find();
            return vignetteSubmissionService;
          },
        ),
        ChangeNotifierProvider(
          create: (context) {
            PencilBoxManager pencilBoxManager = Get.find();
            return pencilBoxManager;
          },
        ),
        ChangeNotifierProvider(
          create: (context) {
            RadiusSliderService radiusSliderService = Get.find();
            return radiusSliderService;
          },
        ),
        ChangeNotifierProvider(
          create: (context) {
            GenerateDifferenceSliderService generateDifferenceSliderService =
                Get.find();
            return generateDifferenceSliderService;
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
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
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
        '/ObservableGamePage': (context) => ObservableGamePage(),
        '/TakePictureScreen': (context) =>
            TakePictureScreen(camera: firstCamera),
        '/chatPage': (context) => ChatPage(),
        '/ReserPasswordPage': (context) => ResetPasswordPage(),
        '/HistoricPage': (context) => HistoricPage(),
        '/social': (context) => SocialPage(),
        '/users': (context) => AllUsersPage(),
        '/friendReq': (context) => FriendRequestsPage(),
        '/friendList': (context) => FriendsListPage(),
      },
    );
  }
}
