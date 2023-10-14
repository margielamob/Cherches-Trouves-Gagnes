import 'package:app/data/carrousel_data.dart';
import 'package:app/data/game_card_data.dart';

class CarrouselRequestData {
  final CarrouselData carrouselData;
  final List<GameCardData> gameCardData;

  CarrouselRequestData({
    required this.carrouselData,
    required this.gameCardData,
  });

  factory CarrouselRequestData.fromJson(Map<String, dynamic> json) {
    final carouselInfoJson = json['carouselInfo'];
    final gamesList = json['games'] as List<dynamic>;

    return CarrouselRequestData(
      carrouselData: CarrouselData.fromJson(carouselInfoJson),
      gameCardData:
          gamesList.map((gameJson) => GameCardData.fromJson(gameJson)).toList(),
    );
  }
}
