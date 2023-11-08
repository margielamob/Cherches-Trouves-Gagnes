import 'package:app/components/image_border.dart';
import 'package:app/domain/models/requests/joinable_games_request.dart';
import 'package:flutter/material.dart';

class Players extends StatelessWidget {
  final List<PlayerModel> players;

  Players({required this.players});

  @override
  Widget build(BuildContext context) {
    return Text("list des joueurs");
  }
}

class ReachableGamesCard extends StatelessWidget {
  final JoinableGamesModel game;

  const ReachableGamesCard({required this.game});

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
              padding: EdgeInsets.all(8.0),
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
                    "Nombre de différences : ${game.nbDifferences}",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  Players(
                    players: game.players,
                  ),
                  SizedBox(height: 10),
                ],
              ),
            ),
          ),
        ])
      ],
    );
  }
}
