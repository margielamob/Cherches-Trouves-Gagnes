import 'package:app/domain/models/vignettes_model.dart';
import 'package:app/domain/services/classic_game_service.dart';
import 'package:app/components/game_vignette.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class Classic extends StatelessWidget {
  final ClassicGameService _classicGameService = Get.find();
  final RxDouble x1 = 0.0.obs;
  final RxDouble y1 = 0.0.obs;
  final String bmpOriginalId;
  final String bmpModifiedId;

  Classic({required this.bmpOriginalId, required this.bmpModifiedId});

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
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Column(
                        children: <Widget>[
                          GestureDetector(
                            onTapUp: (details) {
                              x1.value = details.localPosition.dx;
                              y1.value = details.localPosition.dy;
                            },
                            child: GameVignette(
                              VignettesModel(
                                  modified: image.modified,
                                  original: image.original),
                              [
                                Offset(100, 200),
                                Offset(300, 150),
                              ],
                            ),
                          ),
                          Obx(() => Text(
                              "Coordinate x : ${x1.value}, y : ${y1.value}"))
                        ],
                      ),
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
