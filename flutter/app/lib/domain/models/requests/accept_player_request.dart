class AcceptPlayerRequest {
  String roomId;
  String opponentsRoomId;
  String playerName;

  AcceptPlayerRequest(
      {required this.roomId,
      required this.opponentsRoomId,
      required this.playerName});

  Map<String, dynamic> toJson() {
    return {
      'roomId': roomId,
      'opponentsRoomId': opponentsRoomId,
      'playerName': playerName,
    };
  }
}
