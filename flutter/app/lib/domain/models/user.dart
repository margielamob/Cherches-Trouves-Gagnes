class UserFormat {
  final String id;
  final String name;
  final String? avatar;

  UserFormat({
    required this.id,
    required this.name,
    this.avatar,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'avatar': avatar,
    };
  }

  factory UserFormat.fromMap(Map<String, dynamic> data) {
    return UserFormat(
      id: data['id'] ?? '',
      name: data['name'] ?? '',
      avatar: data['avatar'] ?? '',
    );
  }
}
