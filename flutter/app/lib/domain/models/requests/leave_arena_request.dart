class LeaveArenaRequest {
  String gameId;

  LeaveArenaRequest({
    required this.gameId,
  });

  Map<String, dynamic> toJson() {
    return {
      'gameId': gameId,
    };
  }
}
