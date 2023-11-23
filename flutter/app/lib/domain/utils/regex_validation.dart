class RegexValidation {
  static bool isNameValid(String name) {
    return name.trim().isNotEmpty &&
        !RegExp(r'[0-9!@#\$%^&*(),.?":{}|<>]').hasMatch(name);
  }
}
