import 'package:app/domain/models/classic_game_model.dart';
import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/models/requests/create_classic_game_request.dart';
import 'package:app/domain/models/requests/game_mode_request.dart';
import 'package:app/domain/models/requests/join_classic_game_request.dart';
import 'package:app/domain/models/requests/join_game_request.dart';
import 'package:app/domain/models/requests/join_game_send_request.dart';
import 'package:app/domain/models/requests/leave_arena_request.dart';
import 'package:app/domain/models/requests/leave_waiting_room_request.dart';
import 'package:app/domain/models/requests/ready_game_request.dart';
import 'package:app/domain/models/requests/user_request.dart';
import 'package:app/domain/models/requests/waiting_room_request.dart';
import 'package:app/domain/models/user_model.dart';
import 'package:app/domain/models/waiting_game_model.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:app/pages/classic_game_page.dart';
import 'package:app/pages/main_page.dart';
import 'package:app/pages/waiting_page.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';

class GameManagerService extends ChangeNotifier {
  final SocketService _socket = Get.find();
  final AuthService _authService = AuthService();
  WaitingRoomInfoRequest? waitingRoomInfoRequest;
  WaitingGameModel? waitingGame;
  GameCardModel? gameCards;
  UserRequest? userRequest;
  UserModel? currentUser;
  String? currentGameId;
  String? currentRoomId;
  List<String> playerInWaitingRoom = [];
  bool isMulti = false;

  GameManagerService() {
    handleSockets();
  }

  void handleSockets() {
    _socket.on(SocketEvent.getGamesWaiting, (dynamic message) {
      print("SocketEvent.getGamesWaiting");
      WaitingGameModel data = WaitingGameModel.fromJson(message);
      waitingGame = data;
      if (data.gamesWaiting.isNotEmpty) {
        data.gamesWaiting.forEach((element) {
          print(element);
        });
      }
      notifyListeners();
    });
    _socket.on(SocketEvent.play, (dynamic message) {
      print("SocketEvent.play");
      currentRoomId = message;
      Get.offAll(Classic(gameId: currentRoomId!, gameCard: gameCards!));
    });

    _socket.on(SocketEvent.waitPlayer, (dynamic message) {
      print("SocketEvent.waitPlayer : $message");
      waitingRoomInfoRequest = WaitingRoomInfoRequest.fromJson(message);
      Get.to(WaitingPage());
    });
    _socket.on(SocketEvent.updatePlayers, (dynamic message) {
      waitingRoomInfoRequest = WaitingRoomInfoRequest.fromJson(message);
      notifyListeners();
    });
    _socket.on(SocketEvent.gameStarted, (dynamic message) {
      print("SocketEvent.gameStarted : $message");
    });
    _socket.on(SocketEvent.error, (dynamic message) {
      print("SocketEvent.error : $message");
    });
    _socket.on(SocketEvent.playerLeft, (dynamic message) {
      print("SocketEvent.playerLeft : $message");
    });
    _socket.on(SocketEvent.joinGame, (dynamic message) {
      print("SocketEvent.joinGame : $message");
      JoinGameRequest request = JoinGameRequest.fromJson(message);
      joinGameSend(request.roomId);
    });
    _socket.on(SocketEvent.leaveWaiting, (dynamic message) {
      print("SocketEvent.leaveWaiting : $message");
    });
    _socket.on(SocketEvent.creatorLeft, (dynamic message) {
      print(message);
      Get.offAll(MainPage());
    });
  }

  void joinGame(String roomId) {
    // TODO: vérifier si le ID du socket est bon
    JoinClassicGameRequest request = JoinClassicGameRequest(
        user: currentUser!, roomId: roomId, socketId: _socket.socket.id!);
    _socket.send(SocketEvent.joinClassicGame, request.toJson());
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

  void createMultiplayerGame(
      String cardId, bool cheatModeActivated, int timer) {
    try {
      CreateClassicGameRequest data = CreateClassicGameRequest(
          user: currentUser!,
          card: ClassicGameModel(
              id: cardId, cheatMode: cheatModeActivated, timer: timer));
      print(data.toJson());
      _socket.send(SocketEvent.createClassicGame, data.toJson());
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

  void joinGameSend(String roomId) {
    JoinGameSendRequest data = JoinGameSendRequest(gameId: roomId);
    _socket.send(SocketEvent.joinGame, data.toJson());
  }

  void leaveArena(String gameId) {
    LeaveArenaRequest data = LeaveArenaRequest(gameId: gameId);
    _socket.send(SocketEvent.leavingArena, data.toJson());
    print("leavingArena");
  }

  void leaveWaitingRoom() {
    LeaveWaitingRoomRequest data = LeaveWaitingRoomRequest(
        roomId: waitingRoomInfoRequest!.roomId, name: currentUser!.name);
    _socket.send(SocketEvent.leaveWaitingRoom, data.toJson());
    Get.to(MainPage());
  }

  void startGame() {
    ReadyGameRequest data =
        ReadyGameRequest(gameId: waitingRoomInfoRequest!.roomId);
    _socket.send(SocketEvent.ready, data.toJson());
  }

  void setCurrentUser() {
    _authService.getCurrentUser().then((value) {
      currentUser = UserModel(
        id: value!.uid,
        name: value.displayName,
        avatar: value.photoURL,
      );
    });
  }

  bool doesPlayerLaunchGame() {
    return ((waitingRoomInfoRequest!.players.length > 1 &&
            waitingRoomInfoRequest!.players[0].name == currentUser?.name)
        ? true
        : false);
  }
}
