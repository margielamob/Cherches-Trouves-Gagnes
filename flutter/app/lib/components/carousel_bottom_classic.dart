import 'package:app/components/carousel_bottom.dart';
import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CarouselBottomClassic extends CarouselBottom {
  CarouselBottomClassic(GameCardModel data) : super(data: data);
  final GameManagerService gameManagerService = Get.find();
  final String gameId = "1";
  final GameModeModel gameMode = GameModeModel(modeName: "classic");

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(0.0, 8.0, 0.0, 0.0),
      child: Row(
        children: [
          gameManagerService.isGameJoinable(gameId, gameMode)
              ? FilledButton(
                  onPressed: () {
                    // TODO: Change this to look like heavy client.
                    gameManagerService.onClickCreateJoinGame();
                    Navigator.pushNamed(context, "/classic");
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[Text("Créer")],
                  ),
                )
              : FilledButton(
                  onPressed: () {
                    // TODO: Change this to look like heavy client.
                    gameManagerService.onClickPlayGame();
                    Navigator.pushNamed(context, "/waiting");
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text("Joindre"),
                    ],
                  ),
                )
        ],
      ),
    );
  }
}
