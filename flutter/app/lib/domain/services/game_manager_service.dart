import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/models/requests/create_game_request.dart';
import 'package:app/domain/models/requests/game_info_request.dart';
import 'package:app/domain/models/requests/game_mode_request.dart';
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
    });
    _socket.on(SocketEvent.play, (dynamic message) {
      GameInfoRequest data = GameInfoRequest.fromJson(message);
      print("play event received");
      print(data.toJson());
    });
    _socket.on(SocketEvent.waitPlayer, (dynamic message) {
      print("player is waiting");
      print(message);
    });
    _socket.on(SocketEvent.error, (dynamic message) {
      print(message);
      print("SocketEvent.error");
    });
  }

  void sendGameRequest(GameModeModel mode) {
    try {
      GameModeRequest data = GameModeRequest(gameModeModel: mode);
      _socket.send(SocketEvent.getGamesWaiting, data.toJson());
      print(mode);
    } catch (error) {
      print('Error while sending the request: $error');
    }
  }

  void sendCreateGameRequest(
      String player, String mode, String card, bool isMulti) {
    try {
      CreateGameRequest data = CreateGameRequest(
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

  void sendCreateGameMultiRequest(
      String player, String mode, String card, bool isMulti) {
    try {
      CreateGameRequest data = CreateGameRequest(
          gameMode: mode,
          player: player,
          game: Game(card: card, isMulti: isMulti));
      print(data.toJson());
      _socket.send(SocketEvent.createGameMulti, data.toJson());
      print("CreateGame event sent: $data");
    } catch (error) {
      print('Error while sending CreateGame event: $error');
    }
  }

  bool isGameJoinable(String gameId, GameModeModel gameMode) {
    if (waitingGame == null) return false;

    List<String> currentGames = waitingGame!.gamesWaiting;
    for (var game in currentGames) {
      if (game == gameId) return true;
    }
    return false;
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

  void joinMultiplayerGame() {
    print("onClickCreateJoinGame");
  }

  void setGameInformation() {}
}
