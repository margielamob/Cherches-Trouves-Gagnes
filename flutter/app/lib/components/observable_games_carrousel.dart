import 'package:app/components/no_game_observable.dart';
import 'package:app/components/observable_game_card.dart';
import 'package:app/domain/models/requests/joinable_games_request.dart';
import 'package:app/domain/services/observable_game_manager.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class ObservableGamesCarrousel extends StatelessWidget {
  final ObservableGameManager observableGameManager = Get.find();
  final bool isClassicGame;

  ObservableGamesCarrousel({required this.isClassicGame}) {
    observableGameManager.isClassicGameObserve = isClassicGame;
    observableGameManager.getReachableGames(isClassicGame);
  }

  @override
  Widget build(BuildContext context) {
    final ObservableGameManager gameManager =
        Provider.of<ObservableGameManager>(context);

    if (gameManager.observableGames == null) {
      return Center(child: CircularProgressIndicator());
    }

    if (gameManager.observableGames!.games.isEmpty) {
      return Center(child: NoGameObservable());
    }

    final List<JoinableGamesModel> games = gameManager.observableGames!.games;

    return Column(
      children: [
        Expanded(
          child: Center(
            child: ListView.builder(
              shrinkWrap: true,
              scrollDirection: Axis.horizontal,
              itemCount: games.length,
              itemBuilder: (_, index) {
                return ObservableGamesCard(game: games[index]);
              },
            ),
          ),
        ),
      ],
    );
  }
}
