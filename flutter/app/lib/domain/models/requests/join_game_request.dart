class JoinGameRequest {
  String player;
  String gameId;

  JoinGameRequest({required this.player, required this.gameId});

  Map<String, dynamic> toJson() {
    return {
      'player': player,
      'mode': gameId,
    };
  }
}
