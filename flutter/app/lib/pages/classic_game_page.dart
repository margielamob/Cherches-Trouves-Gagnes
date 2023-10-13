import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:app/services/image_loader_service.dart';
import 'package:app/components/game_vignette/game_vignette.dart';
import 'package:get/get.dart';

class Classic extends StatelessWidget {
  final ImageLoaderService _imageLoaderService = ImageLoaderService();
  final RxDouble x = 0.0.obs;
  final RxDouble y = 0.0.obs;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Classic'),
      ),
      body: Center(
        child: FutureBuilder<ui.Image>(
          future: _imageLoaderService.loadImage('difference.bmp'),
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
                        child: GameVignette(image)),
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
