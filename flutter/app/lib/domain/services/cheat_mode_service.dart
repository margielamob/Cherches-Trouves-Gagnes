import 'package:app/domain/models/requests/fetch_difference_request.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:app/domain/utils/vec2.dart';
import 'package:get/get.dart';

class CheatModeService {
  final DifferenceDetectionService diffService = Get.find();
  final GameManagerService gameManagerService = Get.find();
  final SocketService _socket = Get.find();

  bool isCheatModeActivated = false;
  bool isCheating = false;

  List<Vec2> lastDifferencesToFind = [];

  CheatModeService() {
    isCheatModeActivated = _isCheatingActivated();
    handleSocketEvents();
  }

  /*
  socket.on(SocketEvent.FetchDifferences, (gameId: string) => {
              socket.emit(SocketEvent.FetchDifferences, this.gameManager.getNbDifferenceNotFound(gameId));
          });
  */

  void handleSocketEvents() {
    _socket.on(SocketEvent.fetchDifferences, (dynamic message) {
      print("receiving coordinates");
      // TODO: modified lastDifferencesToFind
    });
  }

  void startCheating() {
    print("start cheating");
    //if (isCheatModeActivated) return;
    isCheating = true;

    FetchDifferenceRequest data =
        FetchDifferenceRequest(gameId: gameManagerService.currentRoomId!);

    _socket.send(SocketEvent.fetchDifferences, data.toJson());
    diffService.startBlinking(lastDifferencesToFind, 250);
    // start the cheating
  }

  void stopCheating() {
    if (!isCheating) return;

    // Stop the cheating
    isCheating = false;
  }

  bool _isCheatingActivated() {
    if (gameManagerService.waitingRoomInfoRequest == null) return false;
    if (gameManagerService.waitingRoomInfoRequest!.cheatMode == null) {
      return false;
    }
    return gameManagerService.waitingRoomInfoRequest!.cheatMode!;
  }
}
