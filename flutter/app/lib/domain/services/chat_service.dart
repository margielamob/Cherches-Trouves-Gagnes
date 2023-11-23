import 'package:app/domain/models/user_model.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/chat_display_service.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter_ringtone_player/flutter_ringtone_player.dart';
import 'package:get/get.dart';
import 'package:rxdart/rxdart.dart';

import '../models/chat_model.dart';

class ChatManagerService {
  final SocketService socket = Get.find();
  final AuthService authService = Get.find();
  final ChatDisplayService chatDs = Get.find();

  BehaviorSubject<String> activeRoom = BehaviorSubject<String>.seeded('');

  BehaviorSubject<List<UserRoom>> userRoomList =
      BehaviorSubject<List<UserRoom>>.seeded([]);

  BehaviorSubject<List<String>> allRoomsList =
      BehaviorSubject<List<String>>.seeded([]);

  BehaviorSubject<List<String>> unJoinedRooms =
      BehaviorSubject<List<String>>.seeded([]);

  UserModel activeUser = UserModel(id: '', name: '');

  BehaviorSubject<List<ChatMessage>> messages =
      BehaviorSubject<List<ChatMessage>>.seeded([]);

  BehaviorSubject<int> unreadMessages = BehaviorSubject<int>.seeded(0);

  // final ChatDisplayService display;

  //constructor
  ChatManagerService() {
    authService.userSubject.stream.listen((user) {
      activeUser = UserModel(id: user!.uid, name: user.displayName);
    });
    userRoomList.stream.listen((rooms) {
      int sum = 0;
      for (var room in rooms) {
        if (!room.read) {
          sum++;
        }
      }
      unreadMessages.add(sum);
    });
    allRoomsList.stream.listen((rooms) {
      unJoinedRooms.add(rooms
          .where((element) =>
              !userRoomList.value.map((e) => e.room).toList().contains(element))
          .toList());
    });
    addListeners();
  }

  void selectRoom(String room) {
    activeRoom.add(room);
    fetchMessages();
    //read messages
    socket.send(SocketEvent.ReadMessages, {
      'roomName': room,
      'userName': activeUser.name,
    });

    List<UserRoom> newRooms = userRoomList.value;

    int index = newRooms.indexWhere((element) => element.room == room);

    if (index != -1) {
      newRooms[index].read = true;
      userRoomList.add(newRooms);
    }
  }

  void sendMessage(String message) {
    final newMessage = ChatMessage(
      message: message,
      user: authService.currentUser!.displayName,
      room: activeRoom.value,
    );
    socket.send(SocketEvent.message, {'message': newMessage.toJson()});
  }

  void addMessage(ChatMessage message) {
    messages.add([...messages.value, message]);
  }

  void addListeners() {
    socket.on(SocketEvent.message, (dynamic data) {
      print('message received');
      print(ChatMessage.fromJson(data));
      final message = ChatMessage.fromJson(data);
      if (message.room == activeRoom.value) {
        // AND CHAT DISPLAY IS ACTIVE
        addMessage(message);
        socket.send(SocketEvent.ReadMessages, {
          'roomName': message.room,
          'userName': activeUser.name,
        });
        List<UserRoom> newUserRooms = userRoomList.value;

        int index =
            newUserRooms.indexWhere((element) => element.room == message.room);

        if (index != -1) {
          newUserRooms[index].read = true;
          newUserRooms[index].lastMessage = message;

          userRoomList.add(newUserRooms);
        }
      } else {
        List<UserRoom> newUserRooms = userRoomList.value;

        int index =
            newUserRooms.indexWhere((element) => element.room == message.room);
        if (index != -1) {
          newUserRooms[index].read = false;
          newUserRooms[index].lastMessage = message;

          userRoomList.add(newUserRooms);

          socket.send(SocketEvent.UnreadMessage, {
            'roomName': message.room,
            'userName': activeUser.name,
          });
        }
      }
      if (message.user != activeUser.name) {
        FlutterRingtonePlayer.playNotification();
      }
    });

    socket.on(SocketEvent.updateAllRooms, (dynamic data) {
      final rooms = List<String>.from(data);
      allRoomsList.add(rooms);
    });
    socket.on(SocketEvent.updateUserRooms, (dynamic data) {
      List<UserRoom> rooms = [];
      data.forEach((element) {
        rooms.add(UserRoom.fromJson(element as Map<String, dynamic>));
      });
      userRoomList.add(rooms);
    });
    socket.on(SocketEvent.roomCreated, (dynamic data) {
      final rooms = data as Map<String, dynamic>;
      userRoomList.add(List<UserRoom>.from(rooms['user']));
      allRoomsList.add(List<String>.from(rooms['all']));
    });
    socket.on(SocketEvent.roomDeleted, (dynamic data) {
      fetchUserRooms();
      fetchAllRooms();
    });
    socket.on(SocketEvent.getMessages, (dynamic data) {
      final List<ChatMessage> newMessages = [];

      data.forEach((message) {
        newMessages.add(ChatMessage.fromJson(message as Map<String, dynamic>));
      });

      messages.add(newMessages);
    });
  }

  void initChat() {
    authService.getCurrentUser().then((value) {
      activeUser = UserModel(id: value!.uid, name: value.displayName);
      // addListeners();
      socket.send(SocketEvent.initChat, {'userName': activeUser.name});
    });
  }

  String getCurrentRoom() {
    return activeRoom.value;
  }

  void fetchUserRooms() {
    socket.send(SocketEvent.getUserRooms, {'userName': activeUser.name});
  }

  void fetchAllRooms() {
    socket.send(SocketEvent.getAllRooms);
  }

  void fetchMessages() {
    socket.send(SocketEvent.getMessages, {'roomId': activeRoom.value});
  }

  void createRoom(String roomName) {
    socket.send(SocketEvent.createRoom, {
      'roomName': roomName,
      'userName': activeUser.name,
    });
  }

  void joinRooms(List<String> roomNames) {
    socket.send(SocketEvent.joinRooms, {
      'roomNames': roomNames,
      'userName': activeUser.name,
    });
  }

  bool isOwnMessage(ChatMessage message) {
    return message.user == activeUser.name;
  }

  bool isOpponentMessage(ChatMessage message) {
    return message.user != activeUser.name;
  }

  void leaveRoom(String roomName) {
    socket.send(SocketEvent.leaveRoom, {
      'roomName': roomName,
      'userName': activeUser.name,
    });
  }

  void deleteRoom(String roomName) {
    socket.send(SocketEvent.deleteRoom, {'roomName': roomName});
  }

  void leaveGameChat() {
    if (activeRoom.value.startsWith('Game')) {
      deselectRoom();
    }
    final gameChat =
        userRoomList.value.firstWhere((room) => room.startsWith('Game'));
    socket.send(SocketEvent.leaveRoom,
        {'roomName': gameChat, 'userName': activeUser.name});
  }

  void deselectRoom() {
    activeRoom.add('');
    messages.add([]);
  }
}
