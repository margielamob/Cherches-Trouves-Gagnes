import 'package:app/components/clock.dart';
import 'package:app/components/current_players.dart';
import 'package:app/components/custom_app_bar.dart';
import 'package:app/components/end_game_dialog.dart';
import 'package:app/components/game_vignette_modified.dart';
import 'package:app/components/game_vignette_original.dart';
import 'package:app/components/video_player.dart';
import 'package:app/domain/models/vignettes_model.dart';
import 'package:app/domain/services/classic_game_service.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/end_game_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class Classic extends StatefulWidget {
  final String gameId;

  Classic({required this.gameId});

  @override
  _ClassicState createState() => _ClassicState();
}

class _ClassicState extends State<Classic> {
  final ClassicGameService _classicGameService = Get.find();
  final DifferenceDetectionService _differenceDetectionService = Get.find();
  final GameManagerService gameManagerService = Get.find();
  final SocketService _socket = Get.find();
  final PersonalUserService _userService = Get.find();

  @override
  void initState() {
    super.initState();
    gameManagerService.onGameCardsChanged = () {
      if (gameManagerService.limitedCoords.isNotEmpty) {
        _differenceDetectionService
            .addNewCoords(gameManagerService.limitedCoords);
      }
      setState(() {});
    };
    if (gameManagerService.limitedCoords.isNotEmpty) {
      _differenceDetectionService
          .addNewCoords(gameManagerService.limitedCoords);
    }
    _differenceDetectionService.handleDifferences();
    _socket.send(SocketEvent.gameStarted,
        {widget.gameId: gameManagerService.currentRoomId});
  }

  @override
  Widget build(BuildContext context) {
    final endGameService = Provider.of<EndGameService>(context);
    String title = 'Partie classique';
    if (gameManagerService.gameMode!.value == "Temps Limité") {
      title = 'Partie temps limité';
    }
    return Scaffold(
      appBar: CustomAppBar.buildGameNavigationBar(context, title),
      body: Center(
        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          FutureBuilder<VignettesModel>(
            future: _classicGameService.getImagesFromIds(
                gameManagerService.gameCards!.idOriginalBmp,
                gameManagerService.gameCards!.idEditedBmp),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.done) {
                final images = snapshot.data;
                if (images != null) {
                  if (endGameService.isGameFinished) {
                    _userService.updateUserGamePlayer(
                        gameManagerService.currentUser!.id);
                    gameManagerService.updateTotalTimePlayed();
                    WidgetsBinding.instance.addPostFrameCallback((_) {
                      showDialog(
                        context: context,
                        barrierDismissible: false,
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
                      AbsorbPointer(
                        absorbing: gameManagerService.isObservable,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            GameVignetteModified(images, widget.gameId),
                            SizedBox(width: 50),
                            GameVignetteOriginal(images, widget.gameId),
                          ],
                        ),
                      ),
                      SizedBox(height: 5),
                      (gameManagerService.gameMode!.value == "Classique" &&
                              !gameManagerService.isObservable)
                          ? VideoPlayer()
                          : SizedBox(height: 0),
                      SizedBox(height: 5),
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
