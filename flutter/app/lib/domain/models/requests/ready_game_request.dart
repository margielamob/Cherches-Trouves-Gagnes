class ReadyGameRequest {
  String gameId;

  ReadyGameRequest({
    required this.gameId,
  });

  Map<String, dynamic> toJson() {
    return {
      'roomId': gameId,
    };
  }
}
