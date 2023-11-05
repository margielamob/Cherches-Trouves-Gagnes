class JoinGameSendRequest {
  String player;
  String gameId;

  JoinGameSendRequest({required this.player, required this.gameId});

  factory JoinGameSendRequest.fromJson(Map<String, dynamic> json) {
    return JoinGameSendRequest(
      player: json['player'],
      gameId: json['gameId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'player': player,
      'gameId': gameId,
    };
  }
}
