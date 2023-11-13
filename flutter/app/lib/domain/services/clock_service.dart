import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter/foundation.dart';
import 'package:get/get.dart';

class ClockService extends ChangeNotifier {
  final SocketService _socket = Get.find();
  int? time;
  String timerDisplay = "00:00";

  ClockService() {
    handleSockets();
  }

  void handleSockets() {
    _socket.on(SocketEvent.clock, (timeData) {
      timerDisplay = formatTime(timeData, 2);
      notifyListeners();
    });
  }

  String formatTime(int seconds, int precision) {
    final min = (seconds ~/ 60).toString();
    final sec = (seconds % 60).toString();
    return '${min.padLeft(precision, '0')}:${sec.padLeft(precision, '0')}';
  }
}
