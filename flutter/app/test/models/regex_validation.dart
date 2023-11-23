import 'package:app/domain/utils/regex_validation.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Regex validation Tests', () {
    test('isNameValid should return false when the name only contains spaces ',
        () {
      expect(RegexValidation.isNameValid("   "), false);
    });

    test('isNameValid should return false when the name only contains spaces ',
        () {
      expect(RegexValidation.isNameValid("  34 "), false);
    });

    test('isNameValid should return false when the name is empty ', () {
      expect(RegexValidation.isNameValid(""), false);
    });

    test('isNameValid should return false when the name contains symbols ', () {
      expect(RegexValidation.isNameValid("asdf !"), false);
    });

    test('isNameValid should return false when the name contains symbols ', () {
      expect(RegexValidation.isNameValid("!"), false);
    });

    test('isNameValid should return true when the name is ok', () {
      expect(RegexValidation.isNameValid("asdfasg Absdf"), true);
    });

    test('isNameValid should return true when the name is ok', () {
      expect(RegexValidation.isNameValid("asdfasgAbsdf"), true);
    });
  });
}
