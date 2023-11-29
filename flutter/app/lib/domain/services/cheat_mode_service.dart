import 'package:app/domain/models/requests/fetch_difference_request.dart';
import 'package:app/domain/models/requests/fetch_difference_response.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:app/domain/utils/vec2.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CheatModeService extends ChangeNotifier {
  final DifferenceDetectionService diffService = Get.find();
  final GameManagerService gameManagerService = Get.find();
  final SocketService _socket = Get.find();

  bool isCheating = false;

  List<Vec2> lastDifferencesToFind = [];

  CheatModeService() {
    handleSocketEvents();
  }

  void handleSocketEvents() {
    _socket.on(SocketEvent.fetchDifferences, (dynamic message) {
      FetchDifferenceResponse fetchDifferenceResponse =
          FetchDifferenceResponse.fromJson(message);
      lastDifferencesToFind = [];
      for (var difference in fetchDifferenceResponse.coordinates) {
        lastDifferencesToFind.addAll(difference);
      }
    });
  }

  Future<void> startCheating() async {
    try {
      FetchDifferenceRequest data =
          FetchDifferenceRequest(gameId: gameManagerService.currentRoomId!);

      _socket.send(SocketEvent.fetchDifferences, data.toJson());
      isCheating = true;
      await diffService.showDifferences(lastDifferencesToFind);
    } catch (error) {
      print("error");
    }
  }

  void stopCheating() {
    if (!isCheating) return;
    diffService.stopShowingDifferences();
  }
}
