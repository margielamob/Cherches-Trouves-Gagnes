import 'dart:convert';

class User {
  late String username = '';
  late String password = '';

  User();

  String toJson() {
    var json = {'username': username, 'password': password};
    return jsonEncode(json);
  }

  void setInfos(String username, String password) {
    this.username = username;
    this.password = password;
  }

  bool isLoggedIn() {
    return username.isNotEmpty && password.isNotEmpty;
  }
}
