import 'package:app/domain/utils/vec2.dart';

class FetchDifferenceResponse {
  List<List<Vec2>> coordinates;

  FetchDifferenceResponse({required this.coordinates});

  factory FetchDifferenceResponse.fromJson(List<dynamic> json) {
    List<List<Vec2>> coordinates = json
        .map((pointListJson) => (pointListJson as List<dynamic>)
            .map(
                (pointJson) => Vec2.fromJson(pointJson as Map<String, dynamic>))
            .toList())
        .toList();

    return FetchDifferenceResponse(coordinates: coordinates);
  }
}
