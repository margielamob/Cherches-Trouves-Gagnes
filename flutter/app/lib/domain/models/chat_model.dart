class ChatMessage {
  String message;
  String user;
  String room;

  ChatMessage({
    required this.message,
    required this.user,
    required this.room,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      message: json['message'] as String,
      user: json['user'] as String,
      room: json['room'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'message': message,
      'user': user,
      'room': room,
    };
  }
}

class UserRoom {
  String room;
  bool read = false;

  UserRoom({
    required this.room,
    required this.read,
  });

  factory UserRoom.fromJson(Map<String, dynamic> json) {
    return UserRoom(
      room: json['room'] as String,
      read: json['read'] as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'room': room,
      'read': read,
    };
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
