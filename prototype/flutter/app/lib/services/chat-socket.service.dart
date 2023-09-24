import 'package:app/components/chat-message.dart';
import 'package:app/components/user.dart';
import 'package:app/events/socket-events.dart';
import 'package:app/services/socket-client.service.dart';

class ChatSocketService {
  late SocketClient _socket;

  ChatSocketService(SocketClient socket) {
    _socket = socket;
  }

  void sendMessage(String message, User user) {
    _socket.emit(SocketEvents.PrototypeMessage,
        ChatMessage.createJson(user.username, message));
  }

  void fetchMessages() {
    _socket.emit(SocketEvents.FetchMessages, null);
  }

  List<ChatMessage> generateChatMessageList(User user, dynamic jsonArray) {
    List<ChatMessage> list = [];

    for (var obj in jsonArray) {
      bool isFromUser = obj['user']['username'] == user.username;
      list.add(_createChatMessageFromJson(isFromUser, obj));
    }

    return list;
  }

  void handleMessagesServed(
      User user, void Function(List<ChatMessage>) onMessagesServed) {
    _socket.on(SocketEvents.ServeMessages, (dynamic messages) {
      var messageList = generateChatMessageList(user, messages);
      onMessagesServed(messageList);
    });
  }

  void handleReception(
      User user, void Function(ChatMessage) onMessageReceived) {
    _socket.on(SocketEvents.NewMessage, (Map<String, dynamic> payload) {
      bool isFromUser = payload['user']['username'] == user.username;
      var message = _createChatMessageFromJson(isFromUser, payload);
      onMessageReceived(message);
    });
  }

  ChatMessage _createChatMessageFromJson(bool isFromUser, Map json) {
    return ChatMessage(
      text: json['message'],
      username: json['user']['username'],
      isFromUser: isFromUser,
      date: json['date'].toString(),
    );
  }
}
