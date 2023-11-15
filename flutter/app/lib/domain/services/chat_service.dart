import 'package:app/domain/models/user_model.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:get/get.dart';
import 'package:rxdart/rxdart.dart';

import '../models/chat_model.dart';

class ChatManagerService {
  final SocketService socket = Get.find();
  final AuthService authService = Get.find();

  BehaviorSubject<String> activeRoom = BehaviorSubject<String>.seeded('all');

  BehaviorSubject<List<String>> userRoomList =
      BehaviorSubject<List<String>>.seeded([]);

  BehaviorSubject<List<String>> allRoomsList =
      BehaviorSubject<List<String>>.seeded([]);

  BehaviorSubject<List<String>> unJoinedRooms =
      BehaviorSubject<List<String>>.seeded([]);

  UserModel activeUser = UserModel(id: '', name: '');

  BehaviorSubject<List<ChatMessage>> messages =
      BehaviorSubject<List<ChatMessage>>.seeded([]);

  // final ChatDisplayService display;

  //constructor
  ChatManagerService() {
    authService.userSubject.stream.listen((user) {
      activeUser = {'id': user!.uid, 'name': user.displayName} as UserModel;
    });
  }

  void selectRoom(String room) {
    activeRoom.add(room);
    fetchMessages();
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
        addMessage(message);
      }
    });

    socket.on(SocketEvent.updateAllRooms, (dynamic data) {
      final rooms = List<String>.from(data);
      allRoomsList.add(rooms);
    });
    socket.on(SocketEvent.updateUserRooms, (dynamic data) {
      final rooms = List<String>.from(data);
      userRoomList.add(rooms);
    });
    socket.on(SocketEvent.roomCreated, (dynamic data) {
      final rooms = data as Map<String, dynamic>;
      userRoomList.add(List<String>.from(rooms['user']));
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
    activeUser = UserModel(
        id: authService.currentUser!.uid,
        name: authService.currentUser!.displayName);
    addListeners();
    socket.send(SocketEvent.initChat, {'userName': activeUser.name});
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

  // void leaveGameChat() {
  //   if (activeRoom.value.startsWith('Game')) {
  //     // display.deselectRoom();
  //   }
  //   final gameChat = userRoomList.value
  //       .firstWhere((room) => room.startsWith('Game'), orElse: () => '');
  //   socket.send(SocketEvent.leaveRoom,
  //       {'roomName': gameChat, 'userName': activeUser.name});
  // }
}
