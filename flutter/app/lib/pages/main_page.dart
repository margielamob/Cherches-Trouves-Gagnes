import 'package:app/components/chat/chat_panel.dart';
import 'package:app/components/classic_game_dialog.dart';
import 'package:app/components/logout_dialog.dart';
import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/services/chat_display_service.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:app/domain/utils/game_mode.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:get/get.dart';

class MainPage extends StatefulWidget {
  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  final GameManagerService gameManagerService = Get.find();
  final PersonalUserService userService = Get.find();
  final ChatManagerService chatManagerService = Get.find();

  final ChatDisplayService chatDisplayService = Get.find();

  bool showChat = false;
  int unreadMessages = 0;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    chatDisplayService.isChatVisible.listen((value) {
      setState(() {
        showChat = value;
      });
    });
    chatManagerService.unreadMessages.listen((value) {
      setState(() {
        unreadMessages = value;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    gameManagerService.setCurrentUser();
    return Stack(children: [
      Scaffold(
        appBar: AppBar(
          title: Text("Menu principal"),
          actions: <Widget>[
            Row(
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Badge(
                      isLabelVisible: unreadMessages > 0,
                      label: Text(unreadMessages.toString()),
                      backgroundColor: Colors.red,
                      child: IconButton(
                        icon: Icon(Icons.chat_bubble),
                        onPressed: () => chatDisplayService.toggleChat(),
                      )),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: IconButton(
                    icon: Icon(Icons.exit_to_app),
                    onPressed: () => showDialog(
                        context: context,
                        builder: (BuildContext context) {
                          return LogoutDialog();
                        }),
                  ),
                )
              ],
            )
          ],
        ),
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
                              AppLocalizations.of(context)!.mainPageTitle,
                              style: TextStyle(
                                  fontSize: 35, fontWeight: FontWeight.bold),
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
                          minimumSize:
                              MaterialStateProperty.all(Size(180.0, 60.0)),
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
                        child:
                            Text(AppLocalizations.of(context)!.mainPageClassic),
                      ),
                      SizedBox(height: 30),
                      ElevatedButton(
                        style: ButtonStyle(
                          minimumSize:
                              MaterialStateProperty.all(Size(180.0, 60.0)),
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
                        child:
                            Text(AppLocalizations.of(context)!.mainPageLimited),
                      ),
                      SizedBox(height: 30),
                      ElevatedButton(
                        style: ButtonStyle(
                          minimumSize:
                              MaterialStateProperty.all(Size(180.0, 60.0)),
                        ),
                        onPressed: () {
                          Navigator.pushNamed(context, '/adminPage');
                        },
                        child: Text('Administration'),
                      ),
                      SizedBox(height: 30),
                      ElevatedButton(
                        style: ButtonStyle(
                          minimumSize:
                              MaterialStateProperty.all(Size(180.0, 60.0)),
                        ),
                        onPressed: () {
                          Navigator.pushNamed(context, '/ProfilePage');
                        },
                        child: Text(
                            AppLocalizations.of(context)!.mainPageSettings),
                      ),
                      SizedBox(height: 30),
                      ElevatedButton(
                        style: ButtonStyle(
                          minimumSize:
                              MaterialStateProperty.all(Size(160.0, 60.0)),
                        ),
                        onPressed: () {
                          Navigator.pushNamed(context, '/chatPage');
                        },
                        child: Text('Go to chat'),
                      ),
                      SizedBox(height: 20),
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
                              'Thierry, Ahmed El, Sulayman, Ahmed Ben, Skander, Samy',
                              style: TextStyle(
                                  fontSize: 15, fontWeight: FontWeight.w400),
                            ),
                          )
                        ],
                      )
                    ],
                  ),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Image.asset(
                        'assets/quote.png',
                        height: 600,
                      ),
                    ],
                  ),
                ],
              )
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
    ]);
  }
}
