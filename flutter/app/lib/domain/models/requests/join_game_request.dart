class JoinGameRequest {
  String roomId;
  String playerName;

  JoinGameRequest({required this.roomId, required this.playerName});

  factory JoinGameRequest.fromJson(Map<String, dynamic> json) {
    return JoinGameRequest(
      roomId: json['roomId'],
      playerName: json['playerName'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'roomId': roomId,
      'playerName': playerName,
    };
  }
}
