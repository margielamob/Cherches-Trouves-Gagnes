import 'package:app/data/carousel_data.dart';
import 'package:app/data/game_card_data.dart';

class CarouselRequestData {
  final CarouselData carouselData;
  final List<GameCardData> gameCardData;

  CarouselRequestData({
    required this.carouselData,
    required this.gameCardData,
  });

  factory CarouselRequestData.fromJson(Map<String, dynamic> json) {
    final carouselInfoJson = json['carouselInfo'];
    final gamesList = json['games'] as List<dynamic>;

    return CarouselRequestData(
      carouselData: CarouselData.fromJson(carouselInfoJson),
      gameCardData:
          gamesList.map((gameJson) => GameCardData.fromJson(gameJson)).toList(),
    );
  }
}
