import 'package:app/domain/models/user_model.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:get/get.dart';
import 'package:rxdart/rxdart.dart';

import 'chat_display_service.dart'; // Import your ChatDisplayService
import 'chat_message.dart'; // Import your ChatMessage
import 'communication_socket_service.dart'; // Import your CommunicationSocketService
import 'socket_event.dart'; // Import your SocketEvent
import 'user.dart'; // Import your UserData
import 'user_service.dart'; // Import your UserService

class ChatMessage {
  String message;
  String? user;
  String room;

  ChatMessage({
    required this.message,
    this.user,
    required this.room,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      message: json['message'] as String,
      user: json['user'] as String?,
      room: json['room'] as String,
    );
  }
}

class ChatRoom {
  ChatRoomInfo info;
  List<ChatMessage> messages;

  ChatRoom({
    required this.info,
    required this.messages,
  });
}

class ChatRoomInfo {
  String name;
  ChatMessage? lastMessage;

  ChatRoomInfo({
    required this.name,
    this.lastMessage,
  });
}

class ChatUser {
  String displayName;

  ChatUser({
    required this.displayName,
  });
}

class ChatManagerService {
  final SocketService socket = Get.find();
  final AuthService authService = Get.find();

  BehaviorSubject<String> activeRoom = BehaviorSubject<String>.seeded('all');
  BehaviorSubject<List<String>> userRoomList =
      BehaviorSubject<List<String>>.seeded([]);
  BehaviorSubject<List<String>> allRoomsList =
      BehaviorSubject<List<String>>.seeded([]);
  UserModel activeUser = UserModel(id: '', name: '');

  BehaviorSubject<List<ChatMessage>> messages =
      BehaviorSubject<List<ChatMessage>>.seeded([]);

  // final ChatDisplayService display;

  //constructor
  ChatManagerService() {
    authService.userSubject.stream.listen((user) {
      activeUser = user!;
    });
  }

  void selectRoom(String room) {
    activeRoom.add(room);
    fetchMessages();
  }

  void sendMessage(String message) {
    final newMessage = ChatMessage(
      message: message,
      user: activeUser.name,
      room: activeRoom.value,
    );
    socket.send(SocketEvent.message, {'message': newMessage});
  }

  void addMessage(ChatMessage message) {
    final currentMessages = messages.value;
    currentMessages.add(message);
    messages.add(currentMessages);
  }

  void addListeners() {
    socket.on(SocketEvent.message, (dynamic data) {
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
      final messages = List<ChatMessage>.from(data)
          .map((item) => ChatMessage.fromJson(item as Map<String, dynamic>))
          .toList();
      this.messages.add(messages);
    });
  }

  void initChat() {
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

  void leaveGameChat() {
    if (activeRoom.value.startsWith('Game')) {
      // display.deselectRoom();
    }
    final gameChat = userRoomList.value
        .firstWhere((room) => room.startsWith('Game'), orElse: () => '');
    socket.send(SocketEvent.leaveRoom,
        {'roomName': gameChat, 'userName': activeUser.name});
  }
}
