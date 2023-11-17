class StartClockRequest {
  int timer;
  String roomId;

  StartClockRequest({
    required this.timer,
    required this.roomId,
  });

  Map<String, dynamic> toJson() {
    return {
      'timer': timer,
      'roomId': roomId,
    };
  }
}
