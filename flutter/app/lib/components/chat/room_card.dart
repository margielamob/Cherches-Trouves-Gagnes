import 'package:app/domain/services/chat_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class RoomCardWidget extends StatefulWidget {
  final String room;

  RoomCardWidget({required this.room}) {}

  @override
  State<RoomCardWidget> createState() => _RoomCardWidgetState();
}

class _RoomCardWidgetState extends State<RoomCardWidget> {
  final ChatManagerService chatManager = Get.find();

  String activeRoom = '';

  @override
  void initState() {
    super.initState();
    chatManager.activeRoom.listen((value) {
      setState(() {
        activeRoom = value;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(15),
      child: GestureDetector(
        onTap: () => selectRoom(widget.room),
        child: Container(
          padding: EdgeInsets.all(8.0),
          decoration: BoxDecoration(
            color: chatManager.activeRoom.value == widget.room
                ? Colors.blue[100]
                : Colors.white,
            borderRadius: BorderRadius.circular(8.0),
            border: Border.all(color: Colors.black),
          ),
          child: Row(
            children: [
              Text(
                widget.room,
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              Spacer(),
              if (widget.room != 'all' && !widget.room.startsWith('Game'))
                PopupMenuButton<String>(
                  onSelected: (value) {
                    if (value == 'leave') {
                      leaveRoom();
                    } else if (value == 'delete') {
                      deleteRoom();
                    }
                  },
                  itemBuilder: (BuildContext context) =>
                      <PopupMenuEntry<String>>[
                    const PopupMenuItem<String>(
                      value: 'leave',
                      child: ListTile(
                        leading: Icon(Icons.logout),
                        title: Text('Quitter'),
                      ),
                    ),
                    const PopupMenuItem<String>(
                      value: 'delete',
                      child: ListTile(
                        leading: Icon(Icons.delete),
                        title: Text('Supprimer'),
                      ),
                    ),
                  ],
                  child: Icon(Icons.more_vert),
                ),
            ],
          ),
        ),
      ),
    );
  }

  void selectRoom(String room) {
    chatManager.selectRoom(room);
  }

  void leaveRoom() {
    chatManager.leaveRoom(widget.room);
  }

  void deleteRoom() {
    chatManager.deleteRoom(widget.room);
  }
}
