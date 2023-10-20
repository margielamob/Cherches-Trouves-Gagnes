import 'package:app/domain/services/classic_game_service.dart';
import 'package:app/components/game_vignette.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'dart:ui' as ui;

class Classic extends StatelessWidget {
  final ClassicGameService _classicGameService = Get.find();
  final RxDouble x1 = 0.0.obs;
  final RxDouble y1 = 0.0.obs;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Classic'),
      ),
      body: Center(
        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          FutureBuilder<ui.Image>(
            future: _classicGameService
                .getImageFromId("af110df7-2bfe-443a-9c55-6e6392975b6d"),
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
                            child: GameVignette(image),
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

// TODO: 
// Commencer à jouer avec les pinceaux et les positions
// Commencer à comprendre comment est-ce que les traits sont faits
// Faire un service qui demande les deux images en même temps pour éviter qu'on
// utilise deux fois Future.builder