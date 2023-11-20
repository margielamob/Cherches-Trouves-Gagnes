import 'package:app/domain/utils/base_url.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('BaseURL', () {
    test('The dev url should be http://localhost:3000', () {
      expect(BaseURL.base, "http://localhost:3000");
    });
  });
}
