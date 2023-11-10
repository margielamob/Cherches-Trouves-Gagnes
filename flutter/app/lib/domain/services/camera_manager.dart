import 'package:camera/camera.dart';

class CameraManager {
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
}
