import 'package:app/domain/models/classic_game_model.dart';
import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/models/limited_game_model.dart';
import 'package:app/domain/models/requests/create_classic_game_request.dart';
import 'package:app/domain/models/requests/create_limited_game_request.dart';
import 'package:app/domain/models/requests/difference_found_message.dart';
import 'package:app/domain/models/requests/game_mode_request.dart';
import 'package:app/domain/models/requests/join_classic_game_request.dart';
import 'package:app/domain/models/requests/join_game_request.dart';
import 'package:app/domain/models/requests/join_game_send_request.dart';
import 'package:app/domain/models/requests/leave_arena_request.dart';
import 'package:app/domain/models/requests/leave_waiting_room_request.dart';
import 'package:app/domain/models/requests/new_game_request.dart';
import 'package:app/domain/models/requests/play_limited_request.dart';
import 'package:app/domain/models/requests/ready_game_request.dart';
import 'package:app/domain/models/requests/start_clock_request.dart';
import 'package:app/domain/models/requests/timer_request.dart';
import 'package:app/domain/models/requests/user_request.dart';
import 'package:app/domain/models/requests/waiting_room_request.dart';
import 'package:app/domain/models/user_model.dart';
import 'package:app/domain/models/waiting_game_model.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/global_variables.dart';
import 'package:app/domain/services/personal_user_service.dart';
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
  final GlobalVariables global = Get.find();
  final SocketService _socket = Get.find();
  final AuthService _authService = AuthService();
  final PersonalUserService _userService = Get.find();
  WaitingRoomInfoRequest? waitingRoomInfoRequest;
  WaitingGameModel? waitingGame;
  GameCardModel? gameCards;
  UserRequest? userRequest;
  List<UserModel> players = [];
  UserModel? currentUser;
  String? currentGameId;
  String? currentRoomId;
  List<String> playerInWaitingRoom = [];
  bool isMulti = false;
  int startingTimer = 0;
  int creatorStartingTimer = 0;
  GameModeModel? gameMode;

  GameManagerService() {
    handleSockets();
  }

  void handleSockets() {
    _socket.on(SocketEvent.getGamesWaiting, (dynamic message) {
      WaitingGameModel data = WaitingGameModel.fromJson(message);
      waitingGame = data;
      notifyListeners();
    });
    _socket.on(SocketEvent.play, (dynamic message) {
      if (gameMode!.value == "Classique") {
        currentRoomId = message;
        Get.offAll(Classic(gameId: currentRoomId!, gameCard: gameCards!));
      } else if (gameMode!.value == "Temps Limité") {
        PlayLimitedRequest data = PlayLimitedRequest.fromJson(message);
        Get.offAll(Classic(gameId: data.gameId, gameCard: data.gameCard, startDifference: data.data.coords));
      }
    });
    _socket.on(SocketEvent.waitPlayer, (dynamic message) {
      waitingRoomInfoRequest = WaitingRoomInfoRequest.fromJson(message);
      players = waitingRoomInfoRequest!.players;
      Get.offAll(WaitingPage());
    });
    _socket.on(SocketEvent.updatePlayers, (dynamic message) {
      waitingRoomInfoRequest = WaitingRoomInfoRequest.fromJson(message);
      players = waitingRoomInfoRequest!.players;
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
      JoinGameRequest request = JoinGameRequest.fromJson(message);
      joinGameSend(currentUser!.name, request.roomId);
    });
    _socket.on(SocketEvent.leaveWaiting, (dynamic message) {});
    _socket.on(SocketEvent.creatorLeft, (dynamic message) {});
    _socket.on(SocketEvent.win, (dynamic message) {
      resetAllPlayersNbDifference();
    });
    _socket.on(SocketEvent.lose, (dynamic message) {
      resetAllPlayersNbDifference();
    });
    _socket.on(SocketEvent.startClock, (dynamic message) {
      TimerRequest request = TimerRequest.fromJson(message);
      startingTimer = request.timer;
    });
    _socket.on(SocketEvent.newGameBoard, (dynamic message) {
      print('newGameBoard received');
      NewGameRequest request = NewGameRequest.fromJson(message);
      gameCards = request.gameInfo;
      notifyListeners();
    });
  }

  void joinGame(String roomId) {
    JoinClassicGameRequest request = JoinClassicGameRequest(
        user: currentUser!, roomId: roomId, socketId: _socket.socket.id!);
    _socket.send(SocketEvent.joinClassicGame, request.toJson());
  }

  void sendGameRequest() {
    try {
      GameModeRequest data = GameModeRequest(gameModeModel: gameMode!);
      _socket.send(SocketEvent.getGamesWaiting, data.toJson());
      print(gameMode);
    } catch (error) {
      print('Error while sending the request: $error');
    }
  }

  void createMultiplayerGame(
      String cardId, bool cheatModeActivated, int timer) {
    creatorStartingTimer = timer;
    try {
      CreateClassicGameRequest data = CreateClassicGameRequest(
          user: currentUser!,
          card: ClassicGameModel(
              id: cardId, cheatMode: cheatModeActivated, timer: timer));
      _socket.send(SocketEvent.createClassicGame, data.toJson());
      print("CreateGame event sent: $data");
    } catch (error) {
      print('Error while sending CreateGame event: $error');
    }
  }

  void createLimitedGame(int timer, int bonus, bool cheatModeActivated) {
    CreateLimitedGameRequest data = CreateLimitedGameRequest(
        user: currentUser!,
        card: LimitedGameModel(id: null, timer: timer, bonus: bonus));
    _socket.send(SocketEvent.CreateLimitedGame, data.toJson());
  }

  bool isGameJoinable(String gameId, GameModeModel gameMode) {
    if (waitingGame == null) return false;
    List<String> currentGames = waitingGame!.gamesWaiting;
    for (var game in currentGames) {
      if (game == gameId) return true;
    }
    return false;
  }

  void joinGameSend(String playerName, String roomId) {
    JoinGameSendRequest data =
        JoinGameSendRequest(player: playerName, gameId: roomId);
    _socket.send(SocketEvent.joinGame, data.toJson());
  }

  void leavingArena() {
    LeaveArenaRequest data = LeaveArenaRequest(gameId: currentRoomId!);
    _socket.send(SocketEvent.leavingArena, data.toJson());
    print("leavingArena");
  }

  void leaveWaitingRoom() {
    LeaveWaitingRoomRequest data = LeaveWaitingRoomRequest(
        roomId: waitingRoomInfoRequest!.roomId, name: currentUser!.name);
    _socket.send(SocketEvent.leaveWaitingRoom, data.toJson());
    Get.offAll(MainPage(), transition: Transition.leftToRight);
  }

  void startGame() {
    ReadyGameRequest data =
        ReadyGameRequest(gameId: waitingRoomInfoRequest!.roomId);
    _socket.send(SocketEvent.ready, data.toJson());
    StartClockRequest clockData = StartClockRequest(
        timer: startingTimer, roomId: waitingRoomInfoRequest!.roomId);
    _socket.send(SocketEvent.startClock, clockData.toJson());
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

  void updatePlayersNbDifference(DifferenceFoundMessage differenceFound) {
    for (var player in players) {
      if (player.name == differenceFound.playerName) {
        for (var diff in player.nbDifferenceFound) {
          if (diff.x == differenceFound.differenceCoord.x &&
              diff.y == differenceFound.differenceCoord.y) {
            return;
          }
        }
        if (player.name == currentUser!.name && !global.isModeReplayActivated) {
          _userService.updateUserNbDiffFound(currentUser!.id);
        }
        player.nbDifferenceFound.add(differenceFound.differenceCoord);
      }
    }
    notifyListeners();
  }

  void resetAllPlayersNbDifference() {
    for (var player in players) {
      player.nbDifferenceFound = [];
    }
    notifyListeners();
  }

  void resetPlayerNbDifference(String playerName) {
    for (var player in players) {
      if (player.name == playerName) {
        player.nbDifferenceFound = [];
      }
    }
  }

  bool doesPlayerLaunchGame() {
    return ((waitingRoomInfoRequest!.players.length > 1 &&
            waitingRoomInfoRequest!.players[0].name == currentUser?.name)
        ? true
        : false);
  }
}
