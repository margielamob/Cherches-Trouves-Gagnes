import 'package:app/components/custom_app_bar.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class WaitingPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final gameManagerService = Provider.of<GameManagerService>(context);
    return Scaffold(
      appBar: CustomAppBar.buildDefaultBar(context, 'Waiting Room'),
      body: Center(
          child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            "Les joueurs suivants sont dans la salle d'attente :",
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
                child: Text("Quitter la partie"),
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
                      child: Text("Lancer la partie"),
                    )
                  : Text(""),
            ],
          ),
        ],
      )),
    );
  }
}
