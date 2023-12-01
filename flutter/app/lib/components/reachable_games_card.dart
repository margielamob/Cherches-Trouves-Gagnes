import 'package:app/components/avatar.dart';
import 'package:app/components/image_border.dart';
import 'package:app/domain/models/requests/joinable_games_request.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:get/get.dart';

class Players extends StatelessWidget {
  final List<PlayerModel> players;

  Players({required this.players});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(height: 10),
        SizedBox(
          height: 100,
          width: 300,
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: players.length,
            itemBuilder: (BuildContext context, int index) {
              final playerName = players[index].name;
              final playerAvatar = players[index].avatar;
              return Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Avatar(
                    photoURL: playerAvatar,
                  ),
                  SizedBox(width: 10),
                  Text(playerName, style: TextStyle(fontSize: 16))
                ],
              );
            },
          ),
        ),
      ],
    );
  }
}

class ReachableGamesCard extends StatelessWidget {
  final GameManagerService gameManagerService = Get.find();
  final JoinableGamesModel game;

  ReachableGamesCard({required this.game});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Card(
            shadowColor: Color.fromARGB(255, 46, 46, 46),
            margin: EdgeInsets.all(8.0),
            child: Padding(
              padding: EdgeInsets.fromLTRB(8.0, 8.0, 8.0, 12.0),
              child: Column(
                children: [
                  Text(
                    game.gameInformation.name,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 10),
                  ImageBorder.forSizeBox(
                    color: Colors.black,
                    width: 1.0,
                    sizeBoxChild: SizedBox(
                      width: 320,
                      height: 240,
                      child: Image.memory(
                        game.thumbnail,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  SizedBox(height: 10),
                  Text(
                    "${AppLocalizations.of(context)!.diffNumber} : ${game.nbDifferences}",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  Players(
                    players: game.players,
                  ),
                  SizedBox(height: 10),
                  Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                    FilledButton(
                      style: ButtonStyle(
                        minimumSize:
                            MaterialStateProperty.all(Size(100.0, 40.0)),
                      ),
                      onPressed: () {
                        gameManagerService.gameCards =
                            game.gameInformation.toGameCardModel();
                        gameManagerService.joinGame(game.roomId);
                      },
                      child: Text(AppLocalizations.of(context)!.joinButton),
                    ),
                    SizedBox(width: 20),
                  ]),
                ],
              ),
            ),
          ),
        ])
      ],
    );
  }
}
