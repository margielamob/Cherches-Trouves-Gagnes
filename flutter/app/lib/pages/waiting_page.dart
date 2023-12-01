import 'package:app/components/avatar.dart';
import 'package:app/components/custom_app_bar.dart';
import 'package:app/domain/models/user_model.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class WaitingPage extends StatefulWidget {
  @override
  _WaitingPageState createState() => _WaitingPageState();
}

class _WaitingPageState extends State<WaitingPage> {
  final PersonalUserService userService = Get.find();
  String? avatar;

  Future<void> initAvatar(String photoURL, UserModel user) async {
    String? newAvatar = await userService.initUserAvatar(user);
    setState(() {
      avatar = newAvatar;
    });
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final gameManagerService = Provider.of<GameManagerService>(context);

    return Scaffold(
      appBar: CustomAppBar.buildWaitingRoomBar(
        context,
        AppLocalizations.of(context)!.waitingPageTitle,
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
                  avatar = gameManagerService
                      .waitingRoomInfoRequest?.players[index].avatar;
                  if (avatar!.startsWith('avatars/')) {
                    avatar = 'assets/default-user-icon.jpg';
                    // initAvatar(
                    //     avatar!,
                    //     gameManagerService
                    //         .waitingRoomInfoRequest!.players[index]);
                  }
                  return ListTile(
                    title: Text(playerName!),
                    leading: CircleAvatar(
                      radius: 30,
                      child: Avatar(
                        photoURL: avatar,
                      ),
                    ),
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
                      child:
                          Text(AppLocalizations.of(context)!.waitingPageLaunch),
                    )
                  : Text(""),
            ],
          ),
        ],
      )),
    );
  }
}
