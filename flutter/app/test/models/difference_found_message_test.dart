import 'package:app/domain/models/requests/difference_found_message.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('DifferenceFoundMessage Tests', () {
    test('Should create the proper object', () {
      final incomingJson = {
        "data": {
          "coords": [
            {"x": 24, "y": 44},
            {"x": 48, "y": 84}
          ],
          "nbDifferencesLeft": 9,
          "isPlayerFoundDifference": false
        },
        "playerName": "thierry",
        "differenceCoord": {"x": 100, "y": 54}
      };
      DifferenceFoundMessage diff =
          DifferenceFoundMessage.fromJson(incomingJson);
      expect(diff.playerName, "thierry");
      expect(diff.differenceCoord.x, 100);
      expect(diff.differenceCoord.y, 54);
    });
  });
}
