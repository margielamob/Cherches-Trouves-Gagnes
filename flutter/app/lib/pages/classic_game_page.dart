import 'package:app/components/clock.dart';
import 'package:app/components/current_players.dart';
import 'package:app/components/custom_app_bar.dart';
import 'package:app/components/end_game_dialog.dart';
import 'package:app/components/game_vignette_modified.dart';
import 'package:app/components/game_vignette_original.dart';
import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/models/vignettes_model.dart';
import 'package:app/domain/services/classic_game_service.dart';
import 'package:app/domain/services/clock_service.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/end_game_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class Classic extends StatelessWidget {
  final ClassicGameService _classicGameService = Get.find();
  final DifferenceDetectionService _differenceDetectionService = Get.find();
  final GameManagerService gameManagerService = Get.find();

  final String gameId;
  final GameCardModel gameCard;

  Classic({required this.gameId, required this.gameCard}) {
    _differenceDetectionService.handleDifferences();
  }

  @override
  Widget build(BuildContext context) {
    final endGameService = Provider.of<EndGameService>(context);

    return Scaffold(
      appBar: CustomAppBar.buildGameNavigationBar(context, 'Partie classique'),
      body: Center(
        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          FutureBuilder<VignettesModel>(
            future: _classicGameService.getImagesFromIds(
                gameCard.idOriginalBmp, gameCard.idEditedBmp),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.done) {
                final images = snapshot.data;
                if (images != null) {
                  if (endGameService.isGameFinished) {
                    WidgetsBinding.instance.addPostFrameCallback((_) {
                      showDialog(
                        context: context,
                        builder: (BuildContext context) {
                          return EndGameDialog();
                        },
                      );
                    });
                  }
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(height: 20),
                      Row(
                        children: [
                          Clock(),
                        ],
                      ),
                      SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          GameVignetteModified(images, gameId),
                          SizedBox(width: 50),
                          GameVignetteOriginal(images, gameId),
                        ],
                      ),
                      SizedBox(height: 20),
                      CurrentPlayers(),
                      SizedBox(height: 30),
                    ],
                  );
                }
              }
              return CircularProgressIndicator();
            },
          ),
        ]),
      ),
    );
  }
}
