import 'package:app/domain/models/requests/difference_found_message.dart';
import 'package:app/domain/models/requests/difference_found_request.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/services/sound_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:app/domain/utils/vec2.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class DifferenceDetectionService extends ChangeNotifier {
  final SocketService _socket = Get.find();
  final SoundService _soundService = Get.find();
  final GameManagerService _gameManagerService = Get.find();

  DifferenceDetectionService() {
    handleDifferences();
  }

  List<Vec2> coordinates = [];
  Path? blinkingDifference;
  Paint defaultBlinkingColor = Paint()
    ..color = Colors.yellow
    ..style = PaintingStyle.fill;

  void handleDifferences() {
    _socket.on(SocketEvent.differenceNotFound, (dynamic message) {
      showDifferenceNotFound();
    });
    _socket.on(SocketEvent.differenceFound, (dynamic message) {
      DifferenceFoundMessage data = DifferenceFoundMessage.fromJson(message);
      showDifferenceFound(data);
    });
    _socket.on(SocketEvent.error, (dynamic message) {
      showError(message);
    });
  }

  void showDifferenceFound(DifferenceFoundMessage data) {
    _soundService.playDifferenceFound();
    coordinates.addAll(data.data.coordinates);
    _gameManagerService.updatePlayersNbDifference(data);
    notifyListeners();
    if (_gameManagerService.gameMode!.value != "Temps Limité") {
      startBlinking(data.data.coordinates);
    }
  }

  void showDifferenceNotFound() {
    _soundService.playDifferenceNotFound();
    print("difference not found");
  }

  void showError(dynamic message) {
    _soundService.playDifferenceNotFound();
    print(message);
    print("SocketEvent.error");
  }

  void initDataToBlink(List<Vec2> coords) {
    final path = Path();
    for (var coord in coords) {
      path.addRect(Rect.fromPoints(
          Offset(coord.x.toDouble(), coord.y.toDouble()),
          Offset(coord.x + 1, coord.y + 1)));
    }
    blinkingDifference = path;
  }

  Future<void> startBlinking(List<Vec2> coords) async {
    initDataToBlink(coords);
    if (blinkingDifference == null) return;

    final Path blinkingPath = blinkingDifference!;
    const int timeToBlinkMs = 500;

    for (int i = 0; i < 3; i++) {
      await showDifferenceAndWait(blinkingPath, timeToBlinkMs);
      await hideDifference(timeToBlinkMs);
    }

    resetBlinkingDifference();
  }

  Future<void> showDifferenceAndWait(Path difference, int waitingTimeMs) async {
    blinkingDifference = difference;
    notifyListeners();
    await Future.delayed(Duration(milliseconds: waitingTimeMs));
  }

  Future<void> hideDifference(int waitingTimeMs) async {
    blinkingDifference = null;
    notifyListeners();
    await Future.delayed(Duration(milliseconds: waitingTimeMs));
  }

  void resetBlinkingDifference() {
    blinkingDifference = null;
    notifyListeners();
  }

  void resetForNextGame() {
    blinkingDifference = null;
    coordinates = [];
  }

  bool validate(Vec2 mousePosition, String gameId, bool isOriginal) {
    if (mousePosition.x < 0 || mousePosition.y < 0) return false;
    try {
      final data = DifferenceFoundRequest(
          differenceCoord: mousePosition,
          gameId: gameId,
          isOriginal: isOriginal,
          playerName: _gameManagerService.currentUser!.name);

      _socket.send(SocketEvent.difference, data.toJson());
    } catch (error) {
      print('Error while sending the request: $error');
    }
    return true;
  }

  showDifference(Canvas canvas) {
    final path = Path();
    for (var coord in coordinates) {
      path.addRect(Rect.fromPoints(
          Offset(coord.x.toDouble(), coord.y.toDouble()),
          Offset(coord.x + 1, coord.y + 1)));
    }
    canvas.clipPath(path);
  }

  void addNewCoords(List<Vec2> coords) {
    coordinates.addAll(coords);
    notifyListeners();
  }
}
