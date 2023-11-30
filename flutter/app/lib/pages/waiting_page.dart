import 'package:app/components/chat/chat_panel.dart';
import 'package:app/components/custom_app_bar.dart';
import 'package:app/domain/services/chat_display_service.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class WaitingPage extends StatefulWidget {
  @override
  State<WaitingPage> createState() => _WaitingPageState();
}

class _WaitingPageState extends State<WaitingPage> {
  final ChatManagerService chatManagerService = Get.find();
  final ChatDisplayService chatDisplayService = Get.find();

  bool showChat = false;
  int unreadMessages = 0;

  @override
  void initState() {
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
    final gameManagerService = Provider.of<GameManagerService>(context);
    return Stack(children: [
      Scaffold(
        appBar: CustomAppBar.buildWaitingRoomBar(
          context,
          AppLocalizations.of(context)!.waitingPageTitle,
          unreadMessages,
        ),
        body: Center(
            child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              AppLocalizations.of(context)!.waitingPagePlayers,
              style: TextStyle(fontSize: 20),
            ),
            SizedBox(height: 20),
            CircularProgressIndicator(),
            SizedBox(height: 20),
            SizedBox(
              height: 300,
              width: 300,
              child: Center(
                child: ListView.builder(
                  itemCount:
                      gameManagerService.waitingRoomInfoRequest?.players.length,
                  itemBuilder: (context, index) {
                    final playerName = gameManagerService
                        .waitingRoomInfoRequest?.players[index].name;
                    // final playerPhotoURL = gameManagerService
                    //     .waitingRoomInfoRequest?.players[index].avatar;
                    return ListTile(
                      title: Text(playerName!),
                      // leading: Avatar(
                      //   photoURL: avatarUrl,
                      // ),
                    );
                  },
                ),
              ),
            ),
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton(
                  onPressed: () {
                    gameManagerService.leaveWaitingRoom();
                    chatManagerService.leaveGameChat();
                  },
                  style: ButtonStyle(
                    alignment: Alignment.center,
                    minimumSize: MaterialStateProperty.all<Size>(Size(200, 50)),
                  ).copyWith(
                    backgroundColor: MaterialStateProperty.all<Color>(
                        Theme.of(context).primaryColor),
                    foregroundColor:
                        MaterialStateProperty.all<Color>(Colors.white),
                  ),
                  child: Text(
                    AppLocalizations.of(context)!.waitingPageQuit,
                  ),
                ),
                SizedBox(width: 10),
                gameManagerService.doesPlayerLaunchGame()
                    ? TextButton(
                        onPressed: () {
                          gameManagerService.startGame();
                        },
                        style: ButtonStyle(
                          alignment: Alignment.center,
                          minimumSize:
                              MaterialStateProperty.all<Size>(Size(200, 50)),
                        ).copyWith(
                          backgroundColor: MaterialStateProperty.all<Color>(
                              Theme.of(context).primaryColor),
                          foregroundColor:
                              MaterialStateProperty.all<Color>(Colors.white),
                        ),
                        child: Text(
                            AppLocalizations.of(context)!.waitingPageLaunch),
                      )
                    : Text(""),
              ],
            ),
          ],
        )),
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
