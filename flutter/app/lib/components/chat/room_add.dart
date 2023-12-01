import 'package:app/components/chat/room_create.dart';
import 'package:app/components/chat/room_search.dart';
import 'package:app/domain/services/chat_display_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class RoomAdd extends StatelessWidget {
  final ChatDisplayService chatDisplayService = Get.find();
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
          title: Text('New Room'),
          leading: IconButton(
            icon: Icon(Icons.arrow_back_ios),
            onPressed: goToList,
          ),
        ),
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            RoomCreate(),
            Expanded(child: RoomSearch()),
          ],
        ),
      ),
    );
  }

  void goToList() {
    chatDisplayService.deselectSearch();
  }
}
