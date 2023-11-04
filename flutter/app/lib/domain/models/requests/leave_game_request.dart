class LeaveGameRequest {
  String gameId;

  LeaveGameRequest({
    required this.gameId,
  });

  Map<String, dynamic> toJson() {
    return {
      'gameId': gameId,
    };
  }
}
