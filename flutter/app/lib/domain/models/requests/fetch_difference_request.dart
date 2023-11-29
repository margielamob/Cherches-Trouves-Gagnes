class FetchDifferenceRequest {
  String gameId;

  FetchDifferenceRequest({required this.gameId});

  Map<String, dynamic> toJson() {
    return {
      'gameId': gameId,
    };
  }
}
