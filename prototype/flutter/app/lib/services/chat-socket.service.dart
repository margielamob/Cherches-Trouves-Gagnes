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

  void handleMessagesServed(void Function(dynamic) onMessagesServed) {
    _socket.on(SocketEvents.ServeMessages, (dynamic messages) {
      onMessagesServed(messages);
    });
  }

  void handleReception(
      User user, void Function(ChatMessage) onMessageReceived) {
    _socket.on(SocketEvents.NewMessage, (Map<String, dynamic> payload) {
      bool isFromUser = payload['user']['username'] == user.username;
      var message = ChatMessage(
        text: payload['message'],
        username: payload['user']['username'],
        isFromUser: isFromUser,
        date: payload['date'].toString(),
      );
      onMessageReceived(message);
    });
  }
}
