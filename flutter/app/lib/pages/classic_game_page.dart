import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:app/services/image_loader_service.dart';
import 'package:app/components/game_vignette/game_vignette.dart';

class Classic extends StatelessWidget {
  final ImageLoaderService _imageLoaderService = ImageLoaderService();

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
                return SizedBox(
                  width: image.width.toDouble(),
                  height: image.height.toDouble(),
                  child: GameVignette(image),
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
