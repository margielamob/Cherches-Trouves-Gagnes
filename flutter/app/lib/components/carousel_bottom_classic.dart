import 'package:app/components/carousel_bottom.dart';
import 'package:app/components/game_constants_dialog.dart';
import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/utils/game_mode.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class CarouselBottomClassic extends CarouselBottom {
  CarouselBottomClassic(GameCardModel data) : super(data: data);
  final GameModeModel gameMode = GameModeModel(GameMode.classic);
  final AuthService authService = Get.find();

  @override
  Widget build(BuildContext context) {
    final gameManager = Provider.of<GameManagerService>(context);
    return Padding(
      padding: EdgeInsets.fromLTRB(0.0, 8.0, 0.0, 0.0),
      child: Row(
        children: [
          gameManager.isGameJoinable(data.id, gameMode)
              ? FilledButton(
                  onPressed: () async {
                    try {
                      gameManager.createMultiplayerGame(data.id, true, 100);
                      gameManager.currentGameId = data.id;
                      gameManager.gameCards = data;
                    } catch (error) {
                      print(error);
                    }
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text(AppLocalizations.of(context)!.joinButton)
                    ],
                  ),
                )
              : FilledButton(
                  onPressed: () async {
                    showDialog(
                      context: context,
                      builder: (BuildContext context) {
                        return GameConstantsDialog(
                          data: data,
                        );
                      },
                    );
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text(AppLocalizations.of(context)!.createButton),
                    ],
                  ),
                )
        ],
      ),
    );
  }
}
