class UserModel {
  final String id;
  final String name;
  final String? avatar;
  int nbDifferenceFound;

  UserModel({
    required this.id,
    required this.name,
    this.avatar,
    this.nbDifferenceFound = 0,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'avatar': avatar,
      'nbDifferenceFound': nbDifferenceFound,
    };
  }

  factory UserModel.fromMap(Map<String, dynamic> data) {
    return UserModel(
      id: data['id'] ?? '',
      name: data['name'] ?? '',
      avatar: data['avatar'],
      nbDifferenceFound: data['nbDifferenceFound'] ?? 0,
    );
  }
}
