import 'package:app/services/classic_game_service.dart';
import 'package:app/components/game_vignette/game_vignette.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'dart:typed_data';

class Classic extends StatelessWidget {
  final ClassicGameService _classicGameService = Get.find();
  final RxDouble x = 0.0.obs;
  final RxDouble y = 0.0.obs;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Classic'),
      ),
      body: Center(
        child: FutureBuilder<Uint8List>(
          future: _classicGameService
              .decompressImage("f8442f87-27c7-4353-8c20-b7e83708af9c"),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done) {
              final image = snapshot.data;
              if (image != null) {
                return Column(
                  children: <Widget>[
                    GestureDetector(
                      onTapUp: (details) {
                        x.value = details.localPosition.dx;
                        y.value = details.localPosition.dy;
                      },
                      child: GameVignette(image),
                    ),
                    Obx(() => Text("Coordinate x : ${x.value}, y : ${y.value}"))
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

/*
Image.memory(
    snapshot.data!,
    fit: BoxFit.cover,
  ),
*/