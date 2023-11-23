import 'dart:async';

import 'package:rxdart/rxdart.dart';

class ChatDisplayService {
  final isRoomSelected = BehaviorSubject<bool>.seeded(false);
  final isSearchSelected = BehaviorSubject<bool>.seeded(false);
  final isChatVisible = BehaviorSubject<bool>.seeded(false);

  Stream<bool> get isRoomSelectedStream => isRoomSelected.stream;
  Stream<bool> get isSearchSelectedStream => isSearchSelected.stream;
  Stream<bool> get isChatVisibleStream => isChatVisible.stream;

  // void selectRoom() {
  //   isRoomSelected.add(true);
  // }

  void selectSearch() {
    isSearchSelected.add(true);
  }

  // void deselectRoom() {
  //   isRoomSelected.add(false);
  // }

  void deselectSearch() {
    isSearchSelected.add(false);
  }

  void toggleChat() {
    isChatVisible.add(!isChatVisible.value);
  }

  void deselectRoom() {}

  // void dispose() {
  //   isRoomSelected.close();
  //   isSearchSelected.close();
  //   isChatVisible.close();
  // }
}
