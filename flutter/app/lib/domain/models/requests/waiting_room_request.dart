import 'package:app/domain/models/user.dart';

class WaitingRoomInfoRequest {
  String roomId;
  List<UserFormat> players;
  bool cheatMode;

  WaitingRoomInfoRequest(
      {required this.roomId, required this.players, required this.cheatMode});

  factory WaitingRoomInfoRequest.fromJson(Map<String, dynamic> json) {
    List<UserFormat> players = List<UserFormat>.from(
        json['players'].map((playerJson) => UserFormat.fromMap(playerJson)));

    return WaitingRoomInfoRequest(
      roomId: json['roomId'],
      players: players,
      cheatMode: json['cheatMode'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'roomId': roomId,
      'players': players,
      'cheatMode': cheatMode,
    };
  }
}
