import 'package:app/domain/models/carousel_model.dart';
import 'package:app/domain/models/game_card_model.dart';

class CarouselRequestModel {
  final CarouselModel carouselData;
  final List<GameCardModel> gameCardData;

  CarouselRequestModel({
    required this.carouselData,
    required this.gameCardData,
  });

  factory CarouselRequestModel.fromJson(Map<String, dynamic> json) {
    final carouselInfoJson = json['carouselInfo'];
    final gamesList = json['games'] as List<dynamic>;

    return CarouselRequestModel(
      carouselData: CarouselModel.fromJson(carouselInfoJson),
      gameCardData: gamesList
          .map((gameJson) => GameCardModel.fromJson(gameJson))
          .toList(),
    );
  }
}
