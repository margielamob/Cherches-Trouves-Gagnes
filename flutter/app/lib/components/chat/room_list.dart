import 'package:app/components/chat/room_card.dart';
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
  List<String> rooms = []; // Replace with your data

  @override
  void initState() {
    super.initState();
    chatManager.userRoomList.stream.listen((rooms) {
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
            return rooms.map((e) => RoomCardWidget(room: e)).toList()[index];
          },
        ),
      ),
    );
  }

  void goToSearch() {
    chatDisplayService.selectSearch();
  }

  void selectRoom(String room) {
    chatManager.selectRoom(room);
  }
}
