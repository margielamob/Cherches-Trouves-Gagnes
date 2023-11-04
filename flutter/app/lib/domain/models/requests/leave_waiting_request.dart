class LeaveWaitingRequest {
  String roomId;
  String gameCard;

  LeaveWaitingRequest({
    required this.roomId,
    required this.gameCard,
  });

  Map<String, dynamic> toJson() {
    return {
      'roomId': roomId,
      'gameCard': gameCard,
    };
  }
}
