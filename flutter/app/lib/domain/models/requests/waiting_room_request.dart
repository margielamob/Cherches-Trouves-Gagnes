import 'package:app/domain/models/user_model.dart';

class WaitingRoomInfoRequest {
  String roomId;
  List<UserModel> players;
  bool cheatMode;

  WaitingRoomInfoRequest(
      {required this.roomId, required this.players, required this.cheatMode});

  factory WaitingRoomInfoRequest.fromJson(Map<String, dynamic> json) {
    List<UserModel> players = List<UserModel>.from(
        json['players'].map((playerJson) => UserModel.fromMap(playerJson)));

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
