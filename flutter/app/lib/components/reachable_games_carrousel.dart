import 'package:app/components/no_game_reachable.dart';
import 'package:app/components/reachable_games_card.dart';
import 'package:app/domain/models/requests/joinable_games_request.dart';
import 'package:app/domain/services/reachable_games_manager.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class ReachableGamesCarrousel extends StatelessWidget {
  final ReachableGameManager reachableGamesManager = Get.find();
  final bool isClassicGame;

  ReachableGamesCarrousel({required this.isClassicGame}) {
    reachableGamesManager.isClassicGame = isClassicGame;
    reachableGamesManager.getReachableGames(isClassicGame);
  }

  @override
  Widget build(BuildContext context) {
    final ReachableGameManager gameManager =
        Provider.of<ReachableGameManager>(context);

    if (gameManager.joinableGames == null) {
      return Center(child: CircularProgressIndicator());
    }

    if (gameManager.joinableGames!.games.isEmpty) {
      return Center(child: NoGameReachable());
    }

    final List<JoinableGamesModel> games = gameManager.joinableGames!.games;

    return Column(
      children: [
        Expanded(
          child: Center(
            child: ListView.builder(
              shrinkWrap: true,
              scrollDirection: Axis.horizontal,
              itemCount: games.length,
              itemBuilder: (_, index) {
                return ReachableGamesCard(game: games[index]);
              },
            ),
          ),
        ),
      ],
    );
  }
}
