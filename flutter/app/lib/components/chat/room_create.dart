import 'package:app/domain/services/chat_display_service.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class RoomCreate extends StatefulWidget {
  @override
  _RoomCreate createState() => _RoomCreate();
}

class _RoomCreate extends State<RoomCreate> {
  final TextEditingController _roomNameController = TextEditingController();
  final FocusNode _roomNameFocus = FocusNode();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final ChatManagerService chatManager = Get.find();
  final ChatDisplayService chatDisplayService = Get.find();
  bool isInputEmpty = false;
  bool isRoomCreated = false;
  String errorMessage = '';

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _roomNameController,
                focusNode: _roomNameFocus,
                decoration: InputDecoration(
                  labelText: 'Room Name',
                  border: OutlineInputBorder(),
                ),
                textInputAction: TextInputAction.done,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Room name is required';
                  }
                  return null;
                },
                onFieldSubmitted: (value) {
                  // Hides the keyboard when the "Done" button is pressed
                  _roomNameFocus.unfocus();
                },
              ),
              SizedBox(height: 8.0),
              ElevatedButton(
                onPressed: createRoom,
                child: Text('Create Room'),
              ),
              if (isInputEmpty || isRoomCreated)
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text(
                    errorMessage,
                    style: TextStyle(color: Colors.red),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  void createRoom() {
    setState(() {
      isInputEmpty = false;
      isRoomCreated = false;
      errorMessage = '';

      String roomName = _roomNameController.text.trim();

      if (roomName.isEmpty) {
        isInputEmpty = true;
        errorMessage = 'Room name is required';
      } else if (chatManager.allRoomsList.value.contains(roomName)) {
        isInputEmpty = true;
        errorMessage = 'Room already exists';
      } else {
        // Your logic to create a room goes here
        // For demonstration purposes, let's just print the room name.
        print('Creating room: $roomName');

        // Reset the text controller
        _roomNameController.clear();

        // Set a flag to show a success message
        chatManager.createRoom(roomName);
        chatDisplayService.deselectSearch();
        isRoomCreated = true;
        errorMessage = 'Room created successfully!';
      }
    });
  }
}
