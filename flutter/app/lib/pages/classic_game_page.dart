import 'package:app/components/current_players.dart';
import 'package:app/components/game_vignette_modified.dart';
import 'package:app/components/game_vignette_original.dart';
import 'package:app/domain/models/vignettes_model.dart';
import 'package:app/domain/services/classic_game_service.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class Classic extends StatelessWidget {
  final ClassicGameService _classicGameService = Get.find();
  final DifferenceDetectionService _differenceDetectionService = Get.find();

  final String bmpOriginalId = "11f182b0-4ee2-4842-b344-1a443e69ac5e";
  final String bmpModifiedId = "11f182b0-4ee2-4842-b344-1a443e69ac5e";
  final String gameId;

  Classic({required this.gameId}) {
    _differenceDetectionService.handleDifferences();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Classic'),
      ),
      body: Center(
        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          FutureBuilder<VignettesModel>(
            future: _classicGameService.getImagesFromIds(
                bmpOriginalId, bmpModifiedId),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.done) {
                final images = snapshot.data;
                if (images != null) {
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(height: 20),
                      Row(
                        children: [
                          Icon(
                            Icons.timer,
                            color: Colors.black,
                            size: 30.0,
                          ),
                          SizedBox(width: 10),
                          Text(
                            "00:00",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 30,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          GameVignetteOriginal(images, "fake-game-id"),
                          SizedBox(width: 50),
                          GameVignetteModified(images, "fake-game-id"),
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
