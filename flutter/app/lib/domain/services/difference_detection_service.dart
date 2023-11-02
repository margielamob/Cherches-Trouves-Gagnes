import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/difference_found_message.dart';
import 'package:app/domain/utils/difference_found_request.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:app/domain/utils/vec2.dart';
import 'package:get/get.dart';
import 'package:flutter/material.dart';

class DifferenceDetectionService {
  final SocketService _socket = Get.find();

  final List<Vec2> coordinates = [];

  void handleDifferences() {
    _socket.on(SocketEvent.differenceNotFound, (dynamic message) {
      print("difference not found");
    });
    _socket.on(SocketEvent.differenceFound, (dynamic message) {
      DifferenceFoundMessage data = DifferenceFoundMessage.fromJson(message);
      coordinates.addAll(data.coords);
    });
    _socket.on(SocketEvent.error, (dynamic message) {
      print(message);
      print("SocketEvent.error");
    });
  }

  bool validate(Vec2 mousePosition, String gameId) {
    if (mousePosition.x < 0 || mousePosition.y < 0) return false;
    try {
      final data =
          DifferenceFoundRequest(mousePosition: mousePosition, gameId: gameId);
      _socket.send(SocketEvent.difference, data.toJson());
    } catch (error) {
      print('Error while sending the request: $error');
    }
    return true;
  }

  showDifference(Canvas canvas, List<Vec2> coordinates) {
    _removeOverlayPixels(canvas, coordinates);
  }

  _removeOverlayPixels(Canvas canvas, List<Vec2> coordinates) {
    for (Vec2 coordinate in coordinates) {
      canvas.clipRect(Rect.fromPoints(Offset(coordinate.x, coordinate.x),
          Offset(coordinate.x + 1, coordinate.y + 1)));
    }
  }
}
