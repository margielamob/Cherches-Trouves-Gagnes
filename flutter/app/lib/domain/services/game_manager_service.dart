import 'package:app/domain/models/classic_game_model.dart';
import 'package:app/domain/models/game_card_multi_model.dart';
import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/models/requests/accept_player_request.dart';
import 'package:app/domain/models/requests/create_classic_game_request.dart';
import 'package:app/domain/models/requests/game_mode_request.dart';
import 'package:app/domain/models/requests/join_classic_game_request.dart';
import 'package:app/domain/models/requests/join_game_request.dart';
import 'package:app/domain/models/requests/join_game_send_request.dart';
import 'package:app/domain/models/requests/leave_game_request.dart';
import 'package:app/domain/models/requests/leave_waiting_request.dart';
import 'package:app/domain/models/requests/reject_player_request.dart';
import 'package:app/domain/models/requests/user_request.dart';
import 'package:app/domain/models/requests/waiting_room_request.dart';
import 'package:app/domain/models/user_model.dart';
import 'package:app/domain/models/waiting_game_model.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
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
  GameCardMultiModel? gameInfo;
  UserRequest? userRequest;
  UserModel? currentUser;
  String? currentGameId;
  String? currentRoomId;
  List<String> playerInWaitingRoom = [];
  bool isMulti = false;

  GameManagerService() : gameInfo = null {
    handleSockets();
  }

  /*
    handleSocketEvent() {
        this.socket.once(SocketEvent.Play, (infos: GameId) => {
            if (infos.gameCard) {
                this.setGameInformation(infos.gameCard);
            }
            this.roomId = infos.gameId;
            this.routerService.navigateTo('game');
        });

        this.socket.on(SocketEvent.WaitPlayer, (info: WaitingRoomInfo) => {
            this.roomId = info.roomId;
            this.isMulti = true;
            this.playersEX = info.players;
            this.cheatMode = info.cheatMode;
            this.routerService.navigateTo('waiting');
        });
    }
  */

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
      //if (message is Map<String, dynamic>) {
      //GameInfoRequest data = GameInfoRequest.fromJson(message);
      //print("play event Object received");
      //print(data.toJson());
      // What is the purpose of that
      //} else if (message is String) {
      //GameInfoRequest data = GameInfoRequest(gameId: message);
      //print("play event gameId received");
      //print(data.toJson());
      // TODO : use GameInfoMulti instead of game
      //if (gameCards != null) {
      //  Get.offAll(Classic(gameId: data.gameId, gameCards: gameCards!));
      //} else {
      //  print("Erreur, les gamesCards ne sont pas initialisés");
      //}
      //}
    });
    _socket.on(SocketEvent.waitPlayer, (dynamic message) {
      print("SocketEvent.waitPlayer : $message");
      waitingRoomInfoRequest = WaitingRoomInfoRequest.fromJson(message);
      Get.to(WaitingPage());
    });
    _socket.on(SocketEvent.updatePlayers, (dynamic message) {
      print("SocketEvent.updatePlayers : $message");
      waitingRoomInfoRequest = WaitingRoomInfoRequest.fromJson(message);
      notifyListeners();
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
    _socket.on(SocketEvent.rejectPlayer, (dynamic message) {
      print("SocketEvent.rejectPlayer : $message");
    });
    _socket.on(SocketEvent.requestToJoin, (dynamic message) {
      UserRequest data = UserRequest.fromJson(message);
      userRequest = data;
      playerInWaitingRoom.add(data.name);
      print(data.toJson());
      print("SocketEvent.requestToJoin : $message");
      notifyListeners();
      print("SocketEvent.acceptPlayerSend");
      print({currentRoomId!, data.id, data.name});
      acceptPlayerSend(currentRoomId!, data.id, data.name);
    });
    _socket.on(SocketEvent.leaveWaiting, (dynamic message) {
      print("SocketEvent.leaveWaiting : $message");
    });
    _socket.on(SocketEvent.win, (dynamic message) {
      print("SocketEvent.win : $message");
    });
    _socket.on(SocketEvent.lose, (dynamic message) {
      print("SocketEvent.lose : $message");
    });
  }

  void joinGame(String roomId) {
    // TODO: handle Current user information
    final UserModel user = UserModel(id: "2134", name: "Thierry");

    // TODO: vérifier si le ID du socket est bon
    JoinClassicGameRequest request = JoinClassicGameRequest(
        user: user, roomId: roomId, socketId: _socket.socket.id!);
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
      String cardId, bool cheatModeActivated, int timer) async {
    await _authService.getCurrentUser().then((value) {
      currentUser = UserModel(
        id: value!.uid,
        name: value.displayName,
        avatar: value.photoURL,
      );
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
    });
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

  void acceptPlayerSend(
      String roomId, String opponentsRoomId, String playerName) {
    AcceptPlayerRequest data = AcceptPlayerRequest(
        roomId: roomId,
        opponentsRoomId: opponentsRoomId,
        playerName: playerName);
    _socket.send(SocketEvent.acceptPlayer, data.toJson());
    playerInWaitingRoom = [];
    print("acceptPlayer");
  }

  void rejectPlayer(String roomId, String opponentsRoomId) {
    RejectPlayerRequest data =
        RejectPlayerRequest(roomId: roomId, opponentsRoomId: opponentsRoomId);
    _socket.send(SocketEvent.rejectPlayer, data.toJson());
    playerInWaitingRoom = [];
    print("rejectPlayer");
  }

  void leaveGame(String gameId) {
    LeaveGameRequest data = LeaveGameRequest(gameId: gameId);
    _socket.send(SocketEvent.leaveGame, data.toJson());
    playerInWaitingRoom = [];
    print("leaveGame");
  }

  void leaveWaiting(String roomId, String gameCard) {
    LeaveWaitingRequest data =
        LeaveWaitingRequest(roomId: roomId, gameCard: gameCard);
    _socket.send(SocketEvent.leaveWaiting, data.toJson());
    playerInWaitingRoom = [];
    print("leaveWaiting");
  }

  void startGame() {
    _socket.send(SocketEvent.gameStarted, waitingRoomInfoRequest!.roomId);
  }
}
