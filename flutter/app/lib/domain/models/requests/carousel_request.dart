import 'package:app/domain/models/carousel_model.dart';
import 'package:app/domain/models/game_card_model.dart';

class CarouselRequest {
  final CarouselModel carouselData;
  final List<GameCardModel> gameCardData;

  CarouselRequest({
    required this.carouselData,
    required this.gameCardData,
  });

  factory CarouselRequest.fromJson(Map<String, dynamic> json) {
    final carouselInfoJson = json['carouselInfo'];
    final gamesList = json['games'] as List<dynamic>;

    return CarouselRequest(
      carouselData: CarouselModel.fromJson(carouselInfoJson),
      gameCardData: gamesList
          .map((gameJson) => GameCardModel.fromJson(gameJson))
          .toList(),
    );
  }
}
