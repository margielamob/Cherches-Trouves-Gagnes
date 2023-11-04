class UserRequest {
  final String playerId;
  final String playerName;

  UserRequest({required this.playerId, required this.playerName});

  factory UserRequest.fromJson(Map<String, dynamic> json) {
    return UserRequest(
      playerId: json['id'],
      playerName: json['name'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': playerId,
      'name': playerName,
    };
  }
}
