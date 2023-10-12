import 'dart:ui' as ui;
import 'dart:async';
import 'package:flutter/services.dart';

class ImageLoaderService {
  static final ImageLoaderService _imageLoaderService =
      ImageLoaderService._internal();

  ImageLoaderService._internal();

  factory ImageLoaderService() {
    return _imageLoaderService;
  }

  Future<ui.Image> loadImage(String assetPath) async {
    final ByteData data = await rootBundle.load(assetPath);
    final Uint8List uint8List = data.buffer.asUint8List();
    final Completer<ui.Image> completer = Completer<ui.Image>();
    ui.decodeImageFromList(uint8List, (ui.Image img) {
      completer.complete(img);
    });
    return completer.future;
  }
}
