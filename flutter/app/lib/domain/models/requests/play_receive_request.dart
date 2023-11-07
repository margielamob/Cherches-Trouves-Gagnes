class PlayReceiveRequest {
  final String gameId;

  PlayReceiveRequest({required this.gameId});

  factory PlayReceiveRequest.fromJson(Map<String, dynamic> json) {
    return PlayReceiveRequest(
      gameId: json['gameId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'gameId': gameId,
    };
  }
}
