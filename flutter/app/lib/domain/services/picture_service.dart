import 'package:camera/camera.dart';
import 'package:flutter/material.dart';

class PictureService extends ChangeNotifier {
  XFile? image;
  PictureService();

  void updateImage(XFile image) {
    this.image = image;
    notifyListeners();
  }
}
