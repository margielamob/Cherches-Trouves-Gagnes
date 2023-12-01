import 'dart:async';

import 'package:app/domain/services/chat_display_service.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class RoomSearch extends StatefulWidget {
  @override
  _RoomSearchState createState() => _RoomSearchState();
}

class _RoomSearchState extends State<RoomSearch> {
  ChatManagerService chatManager = Get.find();
  ChatDisplayService chatDisplayService = Get.find();
  List<String> unjoinedRooms = []; // Initialize with empty list
  List<String> selectedRooms = [];
  List<String> searchedRooms = [];
  TextEditingController searchController = TextEditingController();

  StreamSubscription<List<String>>? unjoinedRoomsSubscription;

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    unjoinedRoomsSubscription?.cancel();
  }

  @override
  void initState() {
    print('initState');
    super.initState();
    // Assuming the equivalent logic for fetching initial unjoined rooms is in a function named fetchUnjoinedRooms()
    unjoinedRoomsSubscription = chatManager.allRoomsList.stream.listen((rooms) {
      setState(() {
        List<String> userRoomNames =
            chatManager.userRoomList.value.map((e) => e.room).toList();
        unjoinedRooms =
            rooms.where((element) => !userRoomNames.contains(element)).toList();
        searchedRooms = unjoinedRooms;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            controller: searchController,
            onChanged: (value) {
              filterSearchResults(value);
            },
            decoration: InputDecoration(
              labelText: "Search",
              hintText: "Search",
              prefixIcon: Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.all(
                  Radius.circular(10.0),
                ),
              ),
            ),
          ),
          SizedBox(height: 16.0),
          searchedRooms.isEmpty
              ? Text('No rooms found.')
              : Expanded(
                  child: ListView.builder(
                    itemCount: searchedRooms.length,
                    itemBuilder: (context, index) {
                      final room = searchedRooms[index];
                      return ListTile(
                        title: Text(room),
                        onTap: () {
                          setState(() {
                            if (selectedRooms.contains(room)) {
                              selectedRooms.remove(room);
                            } else {
                              selectedRooms.add(room);
                            }
                          });
                        },
                        tileColor: selectedRooms.contains(room)
                            ? Colors.blue.withOpacity(0.3)
                            : null,
                      );
                    },
                  ),
                ),
          SizedBox(height: 16.0),
          ElevatedButton(
            onPressed: joinRooms,
            child: Text('Join'),
          ),
        ],
      ),
    );
  }

  void filterSearchResults(String query) {
    setState(() {
      searchedRooms = unjoinedRooms
          .where((room) => room.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  void joinRooms() {
    // Replace this with your actual logic to join rooms
    chatManager.joinRooms(selectedRooms);
    chatDisplayService.deselectSearch();
  }
}
