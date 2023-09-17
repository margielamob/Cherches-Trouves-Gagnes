import 'dart:convert';

class User {
  String userName;
  String password;

  User({required this.userName, required this.password});

  String toJson() {
    return jsonEncode(this);
  }
}
