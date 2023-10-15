import 'package:app/services/classic_game_service.dart';
import 'package:app/components/game_vignette/game_vignette.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'dart:ui' as ui;

class Classic extends StatelessWidget {
  final ClassicGameService _classicGameService = Get.find();
  final RxDouble x1 = 0.0.obs;
  final RxDouble y1 = 0.0.obs;
  final RxDouble x2 = 0.0.obs;
  final RxDouble y2 = 0.0.obs;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Classic'),
      ),
      body: Center(
        child: FutureBuilder<ui.Image>(
          future: _classicGameService
              .getImageFromId("f8442f87-27c7-4353-8c20-b7e83708af9c"),
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
                        Obx(() =>
                            Text("Coordinate x : ${x1.value}, y : ${y1.value}"))
                      ],
                    ),
                    SizedBox(width: 20),
                    Column(
                      children: <Widget>[
                        GestureDetector(
                          onTapUp: (details) {
                            x2.value = details.localPosition.dx;
                            y2.value = details.localPosition.dy;
                          },
                          child: GameVignette(image),
                        ),
                        Obx(() =>
                            Text("Coordinate x : ${x2.value}, y : ${y2.value}"))
                      ],
                    ),
                  ],
                );
              }
            }
            return CircularProgressIndicator();
          },
        ),
      ),
    );
  }
}
