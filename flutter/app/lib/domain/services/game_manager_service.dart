import 'package:app/domain/models/classic_game_model.dart';
import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/models/limited_game_model.dart';
import 'package:app/domain/models/requests/bonus_request.dart';
import 'package:app/domain/models/requests/create_classic_game_request.dart';
import 'package:app/domain/models/requests/create_limited_game_request.dart';
import 'package:app/domain/models/requests/difference_found_message.dart';
import 'package:app/domain/models/requests/join_classic_game_request.dart';
import 'package:app/domain/models/requests/join_game_request.dart';
import 'package:app/domain/models/requests/join_game_send_request.dart';
import 'package:app/domain/models/requests/leave_arena_request.dart';
import 'package:app/domain/models/requests/leave_waiting_room_request.dart';
import 'package:app/domain/models/requests/new_game_request.dart';
import 'package:app/domain/models/requests/observe_game_request.dart';
import 'package:app/domain/models/requests/observe_game_reuqest.dart';
import 'package:app/domain/models/requests/play_limited_request.dart';
import 'package:app/domain/models/requests/ready_game_request.dart';
import 'package:app/domain/models/requests/start_clock_request.dart';
import 'package:app/domain/models/requests/timer_request.dart';
import 'package:app/domain/models/requests/user_request.dart';
import 'package:app/domain/models/requests/waiting_room_request.dart';
import 'package:app/domain/models/user_model.dart';
import 'package:app/domain/models/waiting_game_model.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/clock_service.dart';
import 'package:app/domain/services/global_variables.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:app/domain/utils/vec2.dart';
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
  final ClockService _clockService = Get.find();

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
  int creatorStartingTimer = 0;
  int startingTimerReceived = 0;
  int limitedTimerBonus = 0;
  GameModeModel? gameMode;
  List<Vec2> limitedCoords = [];
  VoidCallback? onGameCardsChanged;
  bool isObservable = false;

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
        if (isObservable) {
          ObserveGameReceiveRequest request =
              ObserveGameReceiveRequest.fromJson(message);
          currentRoomId = request.gameId;
          gameCards = request.gameCard;
          limitedCoords = request.data.coords;
          players = request.data.players;
        } else {
          currentRoomId = message;
        }
        Get.offAll(Classic(gameId: currentRoomId!));
      } else if (gameMode!.value == "Temps Limité") {
        PlayLimitedRequest data = PlayLimitedRequest.fromJson(message);
        currentRoomId = data.gameId;
        gameCards = data.gameCard;
        limitedCoords = data.data.coords;
        if (isObservable) {
          ObserveGameReceiveRequest request =
              ObserveGameReceiveRequest.fromJson(message);
          players = request.data.players;
        } 
        Get.offAll(Classic(gameId: currentRoomId!));
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
    _socket.on(SocketEvent.gameStarted, (dynamic message) {});
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
      resetAllPlayerData();
    });
    _socket.on(SocketEvent.lose, (dynamic message) {
      resetAllPlayerData();
    });
    _socket.on(SocketEvent.startClock, (dynamic message) {
      TimerRequest request = TimerRequest.fromJson(message);
      startingTimerReceived = request.timer;
    });
    _socket.on(SocketEvent.startLimitedClock, (dynamic message) {
      TimerRequest request = TimerRequest.fromJson(message);
      startingTimerReceived = request.timer;
    });
    _socket.on(SocketEvent.newGameBoard, (dynamic message) {
      NewGameRequest request = NewGameRequest.fromJson(message);
      gameCards = request.gameInfo;
      limitedCoords = request.coords;
      gameCardsUpdated(gameCards);
    });
    _socket.on(SocketEvent.timerBonus, (dynamic message) {
      BonusRequest request = BonusRequest.fromJson(message);
      limitedTimerBonus += request.bonus;
    });
    _socket.on(SocketEvent.observeGame, (dynamic message) {});
  }

  void gameCardsUpdated(GameCardModel? value) {
    onGameCardsChanged?.call();
    notifyListeners();
  }

  void joinGame(String roomId) {
    JoinClassicGameRequest request = JoinClassicGameRequest(
        user: currentUser!, roomId: roomId, socketId: _socket.socket.id!);
    _socket.send(SocketEvent.joinClassicGame, request.toJson());
  }

  void sendGameRequest() {
    try {
      // GameModeRequest data = GameModeRequest(gameModeModel: gameMode!);
      // _socket.send(SocketEvent.getGamesWaiting, data.toJson());
      // print(gameMode);
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
    } catch (error) {
      print('Error while sending CreateGame event: $error');
    }
  }

  void createLimitedGame(int timer, int bonus, bool cheatModeActivated) {
    creatorStartingTimer = timer;
    try {
      CreateLimitedGameRequest data = CreateLimitedGameRequest(
          user: currentUser!,
          card: LimitedGameModel(id: null, timer: timer, bonus: bonus));
      _socket.send(SocketEvent.CreateLimitedGame, data.toJson());
    } catch (error) {
      print('Error while sending CreateLimitedGame event: $error');
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

  void leaveGame() {
    LeaveArenaRequest data = LeaveArenaRequest(gameId: currentRoomId!);
    _socket.send(SocketEvent.leaveGame, data.toJson());
    resetAllPlayerData();
    Get.offAll(MainPage(), transition: Transition.leftToRight);
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
        timer: creatorStartingTimer, roomId: waitingRoomInfoRequest!.roomId);
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
        player.nbDifferenceFound++;
      }
    }
    notifyListeners();
  }

  void resetAllPlayerData() {
    isObservable = false;
    limitedCoords = [];
    resetAllPlayersNbDifference();
  }

  void resetAllPlayersNbDifference() {
    for (var player in players) {
      player.nbDifferenceFound = 0;
    }
    notifyListeners();
  }

  void resetPlayerNbDifference(String playerName) {
    for (var player in players) {
      if (player.name == playerName) {
        player.nbDifferenceFound = 0;
      }
    }
  }

  bool doesPlayerLaunchGame() {
    return ((waitingRoomInfoRequest!.players.length > 1 &&
            waitingRoomInfoRequest!.players[0].name == currentUser?.name)
        ? true
        : false);
  }

  void updateTotalTimePlayed() {
    if (gameMode!.value == "Temps Limité") {
      updateTotalTimePlayedLimited();
    } else {
      updateTotalTimePlayedClassic();
    }
  }

  void updateTotalTimePlayedLimited() {
    if (creatorStartingTimer != 0) {
      _userService.updateUserTotalTimePlayed(currentUser!.id,
          creatorStartingTimer - _clockService.time! + limitedTimerBonus);
    } else {
      _userService.updateUserTotalTimePlayed(currentUser!.id,
          startingTimerReceived - _clockService.time! + limitedTimerBonus);
    }
  }

  void updateTotalTimePlayedClassic() {
    if (creatorStartingTimer != 0) {
      _userService.updateUserTotalTimePlayed(
          currentUser!.id, creatorStartingTimer - _clockService.time!);
    } else {
      _userService.updateUserTotalTimePlayed(
          currentUser!.id, startingTimerReceived - _clockService.time!);
    }
  }

  void observeGame(String roomId) {
    isObservable = true;
    ObserveGameRequest data =
        ObserveGameRequest(player: currentUser!, roomId: roomId);
    _socket.send(SocketEvent.observeGame, data.toJson());
  }

  Future<String> setUserAvatar(UserModel user) {
    return _userService.initUserAvatar(user);
  }
}
