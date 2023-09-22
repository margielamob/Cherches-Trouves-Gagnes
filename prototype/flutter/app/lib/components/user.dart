class User {
  late String username = '';
  late String password = '';

  User();

  Map toJson() {
    return {'username': username, 'password': password};
  }

  void setInfos(String username, String password) {
    this.username = username;
    this.password = password;
  }

  bool isLoggedIn() {
    return username.isNotEmpty && password.isNotEmpty;
  }

  void dispose() {
    print('called');
    username = '';
    password = '';
  }
}
