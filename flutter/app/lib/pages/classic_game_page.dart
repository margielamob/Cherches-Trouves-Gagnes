import 'package:app/components/current_players.dart';
import 'package:app/components/image_border.dart';
import 'package:app/components/modified_game_vignette.dart';
import 'package:app/components/original_game_vignette.dart';
import 'package:app/domain/models/vignettes_model.dart';
import 'package:app/domain/services/classic_game_service.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class Classic extends StatelessWidget {
  final ClassicGameService _classicGameService = Get.find();
  final DifferenceDetectionService _differenceDetectionService = Get.find();

  final RxDouble x1 = 0.0.obs;
  final RxDouble y1 = 0.0.obs;
  final RxDouble x2 = 0.0.obs;
  final RxDouble y2 = 0.0.obs;
  final String bmpOriginalId;
  final String bmpModifiedId;

  Classic({required this.bmpOriginalId, required this.bmpModifiedId}) {
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
                final image = snapshot.data;
                if (image != null) {
                  return Column(
                    children: [
                      SizedBox(height: 30),
                      Row(
                        children: [
                          Icon(
                            Icons.timer,
                            color: Colors.black,
                            size: 40.0,
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
                      SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Column(
                            children: <Widget>[
                              GestureDetector(
                                onTapUp: (details) {
                                  x1.value = details.localPosition.dx;
                                  y1.value = details.localPosition.dy;
                                },
                                child: ImageBorder.forVignette(
                                  color: Colors.black,
                                  width: 3.0,
                                  vignette: ModifiedGameVignette(
                                    VignettesModel(
                                        modified: image.modified,
                                        original: image.original),
                                  ),
                                ),
                              ),
                              Obx(() => Text(
                                  "Coordinate x : ${x1.value}, y : ${y1.value}"))
                            ],
                          ),
                          SizedBox(width: 50),
                          Column(
                            children: <Widget>[
                              GestureDetector(
                                onTapUp: (details) {
                                  x2.value = details.localPosition.dx;
                                  y2.value = details.localPosition.dy;
                                },
                                child: ImageBorder.forVignette(
                                  color: Colors.black,
                                  width: 3.0,
                                  vignette: OriginalGameVignette(
                                    VignettesModel(
                                        modified: image.modified,
                                        original: image.original),
                                  ),
                                ),
                              ),
                              Obx(() => Text(
                                  "Coordinate x : ${x2.value}, y : ${y2.value}"))
                            ],
                          ),
                        ],
                      ),
                      SizedBox(height: 40),
                      CurrentPlayers(),
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
