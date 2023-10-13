import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:app/services/image_loader_service.dart';
import 'package:app/components/game_vignette/game_vignette.dart';
import 'package:provider/provider.dart';

class Coordinate extends ChangeNotifier {
  double x = 0.0;
  double y = 0.0;

  void setCoordinate(TapUpDetails details) {
    x = details.localPosition.dx;
    y = details.localPosition.dy;
    notifyListeners();
  }
}

class Classic extends StatelessWidget {
  final ImageLoaderService _imageLoaderService = ImageLoaderService();

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => Coordinate(),
      builder: (context, child) => Scaffold(
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
                          onTapUp: (details) =>
                              Provider.of<Coordinate>(context, listen: false)
                                  .setCoordinate(details),
                          child: GameVignette(image)),
                      Consumer<Coordinate>(
                          builder: (_, coordinate, __) => Text(
                              "X coordinate : ${coordinate.x} and ${coordinate.y}"))
                    ],
                  );
                }
              }
              return CircularProgressIndicator();
            },
          ),
        ),
      ),
    );
  }
}
