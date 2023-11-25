import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/services/time_formatter_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter/foundation.dart';
import 'package:get/get.dart';

class ClockService extends ChangeNotifier {
  final SocketService _socket = Get.find();
  final TimeFormatterService _timeFormatter = Get.find();
  int? time;
  String timerDisplay = "00:00";

  ClockService() {
    handleSockets();
  }

  void handleSockets() {
    _socket.on(SocketEvent.clock, (timeData) {
      time = timeData;
      timerDisplay = _timeFormatter.format(timeData, 2);
      notifyListeners();
    });
  }

  void updateTime(int timeDataSeconds) {
    timerDisplay = _timeFormatter.format(timeDataSeconds, 2);
    notifyListeners();
  }
}
