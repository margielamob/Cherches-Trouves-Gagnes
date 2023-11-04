class RejectPlayerRequest {
  String roomId;
  String opponentsRoomId;

  RejectPlayerRequest({
    required this.roomId,
    required this.opponentsRoomId,
  });

  Map<String, dynamic> toJson() {
    return {
      'roomId': roomId,
      'opponentsRoomId': opponentsRoomId,
    };
  }
}
