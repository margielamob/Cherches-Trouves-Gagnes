class UserModel {
  final String id;
  final String name;
  final String? avatar;

  UserModel({
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

  factory UserModel.fromMap(Map<String, dynamic> data) {
    return UserModel(
      id: data['id'] ?? '',
      name: data['name'] ?? '',
      avatar: data['avatar'] ?? '',
    );
  }
}
