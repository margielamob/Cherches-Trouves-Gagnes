import 'dart:async';

import 'package:app/components/chat/chat_panel.dart';
import 'package:app/components/classic_game_dialog.dart';
import 'package:app/components/custom_app_bar.dart';
import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/services/chat_display_service.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:app/domain/services/end_game_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:app/domain/services/profile_page_manager.dart';
import 'package:app/domain/utils/game_mode.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class MainPage extends StatefulWidget {
  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  final GameManagerService gameManagerService = Get.find();
  final PersonalUserService userService = Get.find();
  final ChatManagerService chatManagerService = Get.find();
  final ChatDisplayService chatDisplayService = Get.find();
  final EndGameService endGameService = Get.find();

  bool showChat = false;
  int unreadMessages = 0;

  StreamSubscription<bool>? chatDisplaySubscription;
  StreamSubscription<int>? unreadMessagesSubscription;

  @override
  void dispose() {
    super.dispose();
    chatDisplaySubscription?.cancel();
    unreadMessagesSubscription?.cancel();
  }

  @override
  void initState() {
    super.initState();
    endGameService.resetForNextGame();
    chatDisplaySubscription =
        chatDisplayService.isChatVisible.stream.listen((value) {
      setState(() {
        showChat = value;
      });
    });
    unreadMessagesSubscription =
        chatManagerService.unreadMessages.stream.listen((value) {
      setState(() {
        unreadMessages = value;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final profilePageManager = Provider.of<ProfilePageManager>(context);
    final imagePath = profilePageManager.getImagePath();
    gameManagerService.setCurrentUser();

    return Stack(
      children: [
        Scaffold(
          appBar: CustomAppBar.buildDefaultBar(context,
              AppLocalizations.of(context)!.mainPageTitle, unreadMessages),
          body: WillPopScope(
            onWillPop: () async => false,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Row(
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
                                    AppLocalizations.of(context)!.mainPageTitle,
                                    style: TextStyle(
                                        fontSize: 35,
                                        fontWeight: FontWeight.bold),
                                  ),
                                  SizedBox(width: 20),
                                  Image.asset(
                                    'assets/logoJdD.png',
                                    width: 100,
                                    height: 100,
                                  ),
                                ],
                              ),
                            ),
                            SizedBox(height: 70),
                            ElevatedButton(
                              style: ButtonStyle(
                                minimumSize: MaterialStateProperty.all(
                                    Size(180.0, 60.0)),
                              ),
                              onPressed: () {
                                showDialog(
                                  context: context,
                                  builder: (BuildContext context) {
                                    gameManagerService.gameMode =
                                        GameModeModel(GameMode.classic);
                                    return ClassicGameDialog();
                                  },
                                );
                              },
                              child: Text(AppLocalizations.of(context)!
                                  .mainPageClassic),
                            ),
                            SizedBox(height: 30),
                            ElevatedButton(
                              style: ButtonStyle(
                                minimumSize: MaterialStateProperty.all(
                                    Size(180.0, 60.0)),
                              ),
                              onPressed: () {
                                showDialog(
                                  context: context,
                                  builder: (BuildContext context) {
                                    gameManagerService.gameMode =
                                        GameModeModel(GameMode.limited);
                                    return ClassicGameDialog();
                                  },
                                );
                              },
                              child: Text(AppLocalizations.of(context)!
                                  .mainPageLimited),
                            ),
                            SizedBox(height: 30),
                            ElevatedButton(
                              style: ButtonStyle(
                                minimumSize: MaterialStateProperty.all(
                                    Size(180.0, 60.0)),
                              ),
                              onPressed: () {
                                Navigator.pushNamed(context, '/adminPage');
                              },
                              child: Text('Administration'),
                            ),
                            SizedBox(height: 30),
                            ElevatedButton(
                              style: ButtonStyle(
                                minimumSize: MaterialStateProperty.all(
                                    Size(180.0, 60.0)),
                              ),
                              onPressed: () {
                                Navigator.pushNamed(context, '/social');
                              },
                              child: Text('Social'),
                            ),
                            SizedBox(height: 30),
                            ElevatedButton(
                              style: ButtonStyle(
                                minimumSize: MaterialStateProperty.all(
                                    Size(180.0, 60.0)),
                              ),
                              onPressed: () {
                                Navigator.pushNamed(context, '/ProfilePage');
                              },
                              child: Text(AppLocalizations.of(context)!
                                  .mainPageSettings),
                            ),
                            SizedBox(height: 20),
                          ],
                        ),
                        Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Image.asset(
                              imagePath,
                              height: 600,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        showChat
            ? Positioned(
                height: MediaQuery.of(context).size.height - 100,
                width: MediaQuery.of(context).size.width - 100,
                top: 50,
                left: 50,
                child: ChatPanel())
            : SizedBox.shrink()
      ],
    );
  }
}
