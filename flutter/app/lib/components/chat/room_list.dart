import 'dart:async';

import 'package:app/components/chat/room_card.dart';
import 'package:app/domain/models/chat_model.dart';
import 'package:app/domain/services/chat_display_service.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class RoomList extends StatefulWidget {
  @override
  _RoomListState createState() => _RoomListState();
}

class _RoomListState extends State<RoomList> {
  ChatManagerService chatManager = Get.find();
  ChatDisplayService chatDisplayService = Get.find();
  List<UserRoom> rooms = []; // Replace with your data

  StreamSubscription<List<UserRoom>>? roomSubscription;

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    roomSubscription?.cancel();
  }

  @override
  void initState() {
    super.initState();
    roomSubscription = chatManager.userRoomList.stream.listen((rooms) {
      setState(() {
        this.rooms = rooms;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.all(
          Radius.circular(10),
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: Scaffold(
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: Text('Chat'),
          actions: [
            IconButton(
              icon: Icon(Icons.add),
              onPressed: goToSearch,
              color: Colors.blue, // Set the color to your desired color
            ),
          ],
          // shape: RoundedRectangleBorder(
          //   borderRadius: BorderRadius.vertical(
          //     top: Radius.circular(10),
          //   ),
          // )
        ),
        body: ListView.builder(
          itemCount: rooms.length,
          itemBuilder: (context, index) {
            return RoomCardWidget(room: rooms[index]);
          },
        ),
      ),
    );
  }

  void goToSearch() {
    chatDisplayService.selectSearch();
  }
}
