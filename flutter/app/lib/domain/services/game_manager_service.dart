import 'package:app/domain/models/create_game_request.dart';
import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/models/game_mode_request_model.dart';
import 'package:app/domain/models/waiting_game_model.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/game.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:get/get.dart';

class GameManagerService {
  final SocketService _socket = Get.find();
  WaitingGameModel? waitingGame;
  bool isMulti = false;

  GameManagerService() {
    handleSockets();
  }

  void handleSockets() {
    _socket.on(SocketEvent.getGamesWaiting, (dynamic message) {
      WaitingGameModel data = WaitingGameModel.fromJson(message);
      waitingGame = data;
      print("This is the waitingGame data");
      print(data.toJson());
    });
    _socket.on(SocketEvent.play, (dynamic message) {
      print("play event received");
      // // WaitingGameModel data = WaitingGameModel.fromJson(message);
      // print("This is the data:");
      // print(data);
    });
    _socket.on(SocketEvent.error, (dynamic message) {
      print(message);
      print("SocketEvent.error");
    });
  }

  void sendGameRequest(String mode) {
    try {
      GameModeRequestModel data = GameModeRequestModel(gameMode: mode);
      _socket.send(SocketEvent.getGamesWaiting, data.toJson());
      print("This is the data sent:");
      print(mode);
    } catch (error) {
      print('Error while sending the request: $error');
    }
  }

  void sendCreateGameRequest(
      String player, String mode, String card, bool isMulti) {
    try {
      CreateGameRequestModel data = CreateGameRequestModel(
          gameMode: mode,
          player: player,
          game: Game(card: card, isMulti: isMulti));
      print(data.toJson());
      _socket.send(SocketEvent.createGame, data.toJson());
      print("CreateGame event sent: $data");
    } catch (error) {
      print('Error while sending CreateGame event: $error');
    }
  }

  bool isGameJoinable(String gameId, GameModeModel gameMode) {
    return true;
  }

  void onClickCreateJoinGame() {
    print("onClickCreateJoinGame");
  }

  void sendCreateGameEvent(
      String player, String mode, String card, bool isMultiplayer) {
    final data = {
      'player': player,
      'mode': mode,
      'game': {card: card, isMulti: isMultiplayer},
    };
    _socket.send(SocketEvent.createGame, data);
  }

  void onClickPlayGame() {
    print("onClickPlayGame");
  }

  void setGameInformation() {}
}
