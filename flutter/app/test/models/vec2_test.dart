import 'package:app/domain/utils/vec2.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Vec2 Tests', () {
    test('constructor should create an object', () {
      final vec2 = Vec2(x: 108, y: 102);
      expect(vec2.x, 108);
      expect(vec2.y, 102);
    });
    test('fromJson should return a valid object', () {
      final incomingJson = {"x": 50, "y": 60};
      final vec2 = Vec2.fromJson(incomingJson);
      expect(vec2.x, 50);
      expect(vec2.y, 60);
    });
  });
}
