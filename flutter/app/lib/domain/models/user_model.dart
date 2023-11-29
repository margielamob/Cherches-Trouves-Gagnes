import 'package:app/domain/utils/vec2.dart';

class UserModel {
  final String id;
  final String name;
  final String? avatar;
  List<Vec2> nbDifferenceFound;
  UserModel({required this.id, required this.name, this.avatar})
      : nbDifferenceFound = [];
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
