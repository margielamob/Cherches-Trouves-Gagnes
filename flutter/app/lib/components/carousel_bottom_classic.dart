import 'package:app/components/carousel_bottom.dart';
import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/utils/game_mode.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CarouselBottomClassic extends CarouselBottom {
  CarouselBottomClassic(GameCardModel data) : super(data: data);
  final GameManagerService gameManagerService = Get.find();
  final GameModeModel gameMode = GameModeModel(GameMode.classic);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(0.0, 8.0, 0.0, 0.0),
      child: Row(
        children: [
          gameManagerService.isGameJoinable(data.id, gameMode)
              ? FilledButton(
                  onPressed: () {
                    gameManagerService.createMultiplayerGame('Thierry',
                        GameModeModel(GameMode.classic), data.id, true);
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[Text("Joindre")],
                  ),
                )
              : FilledButton(
                  onPressed: () {
                    gameManagerService.createMultiplayerGame('Thierry',
                        GameModeModel(GameMode.classic), data.id, true);
                    // We won't support solo mode
                    //gameManagerService.createSoloGame('saoul',
                    //GameModeModel(GameMode.classic), data.id, false);
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text("Créer"),
                    ],
                  ),
                )
        ],
      ),
    );
  }
}
