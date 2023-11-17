import 'package:app/domain/models/user_model.dart';

class WaitingRoomInfoRequest {
  String roomId;
  List<UserModel> players;
  bool? cheatMode;

  WaitingRoomInfoRequest(
      {required this.roomId, required this.players, this.cheatMode});

  factory WaitingRoomInfoRequest.fromJson(Map<String, dynamic> json) {
    List<UserModel> players = List<UserModel>.from(
        json['players'].map((playerJson) => UserModel.fromMap(playerJson)));

    return WaitingRoomInfoRequest(
      roomId: json['roomId'],
      players: players,
      cheatMode: json.containsKey('cheatMode') ? json['cheatMode'] : false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'roomId': roomId,
      'players': players,
      if (cheatMode != null) 'cheatMode': cheatMode,
    };
  }
}
