import 'package:app/components/custom_app_bar.dart';
import 'package:app/components/observable_games_carrousel.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/utils/game_mode.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ObservableGamePage extends StatelessWidget {
  final GameManagerService gameManagerService = Get.find();
  final bool enabled = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar:
          CustomAppBar.buildLogoutOnly(context, 'Observables Games available'),
      body: Padding(
        padding: EdgeInsets.all(20.0),
        child: ObservableGamesCarrousel(
            isClassicGame:
                gameManagerService.gameMode?.value == AvailableGameMode.classic
                    ? true
                    : false),
      ),
    );
  }
}
