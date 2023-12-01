import 'dart:async';

import 'package:app/components/chat/room_add.dart';
import 'package:app/components/chat/room_list.dart';
import 'package:app/domain/services/chat_display_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ChatLeftPanel extends StatefulWidget {
  const ChatLeftPanel({super.key});

  @override
  State<ChatLeftPanel> createState() => _ChatLeftPanelState();
}

class _ChatLeftPanelState extends State<ChatLeftPanel> {
  ChatDisplayService chatDisplayService = Get.find();

  bool isSearchSelected = false;

  StreamSubscription<bool>? chatDisplaySubscription;

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    chatDisplaySubscription?.cancel();
  }

  @override
  void initState() {
    super.initState();
    chatDisplaySubscription =
        chatDisplayService.isSearchSelected.stream.listen((value) {
      setState(() {
        isSearchSelected = value;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 100,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.all(
          Radius.circular(10),
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: isSearchSelected ? RoomAdd() : RoomList(),
    );
  }
}
