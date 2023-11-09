class PlayReceiveRequest {
  final String gameId;
  final String? gameCard;

  PlayReceiveRequest({required this.gameId, this.gameCard});

  factory PlayReceiveRequest.fromJson(Map<String, dynamic> json) {
    return PlayReceiveRequest(
      gameId: json['gameId'],
      gameCard: json['gameCard'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'gameId': gameId,
      'gameCard': gameCard,
    };
  }
}
