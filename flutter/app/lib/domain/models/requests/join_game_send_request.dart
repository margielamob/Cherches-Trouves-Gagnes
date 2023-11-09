class JoinGameSendRequest {
  String gameId;

  JoinGameSendRequest({required this.gameId});

  factory JoinGameSendRequest.fromJson(Map<String, dynamic> json) {
    return JoinGameSendRequest(
      gameId: json['gameId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'gameId': gameId,
    };
  }
}
