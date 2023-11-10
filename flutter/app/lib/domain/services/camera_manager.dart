import 'package:camera/camera.dart';
import 'package:flutter/material.dart';

class CameraManager extends ChangeNotifier {
  XFile? image;
  late CameraDescription camera;
  late List<CameraDescription> _cameras;

  CameraManager() {
    fetchAvailableCameras();
  }

  Future<void> fetchAvailableCameras() async {
    _cameras = await availableCameras();
    camera = _cameras.first;
    if (_cameras.length == 2) {
      camera = _cameras[1];
    }
  }

  void updateCurrentImage(XFile image) {
    this.image = image;
    notifyListeners();
  }
}
