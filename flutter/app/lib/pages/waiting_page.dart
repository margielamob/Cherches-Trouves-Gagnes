import 'package:app/components/custom_app_bar.dart';
import 'package:app/domain/models/requests/waiting_room_request.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class WaitingPage extends StatelessWidget {
  final WaitingRoomInfoRequest waitingRoomInfoRequest;

  WaitingPage({Key? key, required this.waitingRoomInfoRequest})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final gameManagerService = Provider.of<GameManagerService>(context);
    print(waitingRoomInfoRequest.toJson());
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
          Expanded(
            child: ListView.builder(
              itemCount: gameManagerService.playerInWaitingRoom.length,
              itemBuilder: (context, index) {
                final playerName =
                    gameManagerService.playerInWaitingRoom[index];
                return ListTile(
                  title: Text(playerName),
                );
              },
            ),
          ),
          SizedBox(height: 20),
          TextButton(
            onPressed: gameManagerService.playerInWaitingRoom.isNotEmpty
                ? () {}
                : null,
            style: ButtonStyle(
              alignment: Alignment.center,
              minimumSize: MaterialStateProperty.all<Size>(Size(300, 50)),
            ).copyWith(
              backgroundColor: MaterialStateProperty.all<Color>(
                  Theme.of(context).primaryColor),
              foregroundColor: MaterialStateProperty.all<Color>(Colors.white),
            ),
            child: Text("Lancer la partie"),
          ),
        ],
      )),
    );
  }
}
