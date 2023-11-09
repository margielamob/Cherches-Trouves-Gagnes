class JoinGameRequest {
  String roomId;

  JoinGameRequest({required this.roomId});

  factory JoinGameRequest.fromJson(Map<String, dynamic> json) {
    return JoinGameRequest(
      roomId: json['roomId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'roomId': roomId,
    };
  }
}
