import 'package:flutter_test/flutter_test.dart';

void main() {
  group('CreateGameVignette', () {
    test('toJson should create the proper request', () {
      // for '/api/game/card/validation'
      final expectedJson = {
        'original': {
          'width': 2,
          'height': 2,
          'data': [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3],
        },
        'modify': {
          'width': 2,
          'height': 2,
          'data': [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]
        },
        'differenceRadius': 0,
        'name': 'test',
      };
      expect(expectedJson, expectedJson);
    });
  });
}
