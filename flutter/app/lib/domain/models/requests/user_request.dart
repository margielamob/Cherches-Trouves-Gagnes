class UserRequest {
<<<<<<< HEAD
  final String id;
  final String name;

  UserRequest({required this.id, required this.name});

  factory UserRequest.fromJson(Map<String, dynamic> json) {
    return UserRequest(
      id: json['id'],
      name: json['name'],
=======
  final String playerId;
  final String playerName;

  UserRequest({required this.playerId, required this.playerName});

  factory UserRequest.fromJson(Map<String, dynamic> json) {
    return UserRequest(
      playerId: json['id'],
      playerName: json['name'],
>>>>>>> dev
    );
  }

  Map<String, dynamic> toJson() {
    return {
<<<<<<< HEAD
      'id': id,
      'name': name,
=======
      'id': playerId,
      'name': playerName,
>>>>>>> dev
    };
  }
}
