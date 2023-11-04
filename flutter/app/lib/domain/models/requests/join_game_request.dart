class JoinGameRequest {
<<<<<<< HEAD
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
=======
  String player;
  String gameId;

  JoinGameRequest({required this.player, required this.gameId});

  Map<String, dynamic> toJson() {
    return {
      'player': player,
      'mode': gameId,
>>>>>>> dev
    };
  }
}
