import 'package:app/domain/models/requests/fetch_difference_response.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Fetch Difference Response Tests', () {
    test('Should create the proper object', () {
      final incomingJson = [
        [
          {"x": 24, "y": 44},
          {"x": 48, "y": 84}
        ],
      ];

      FetchDifferenceResponse diff =
          FetchDifferenceResponse.fromJson(incomingJson);

      expect(diff.coordinates.length, 1);
      expect(diff.coordinates[0].length, 2);
    });
  });
}
