import 'package:app/data/carousel_request_data.dart';
import 'package:app/data/game_card_data.dart';
import 'package:app/services/http_service.dart';
import 'package:get_it/get_it.dart';

class CardFeedService {
  int currentPage = 1;
  late CarouselRequestData carouselState;
  final HttpService _httpService;

  CardFeedService() : _httpService = GetIt.I.get<HttpService>();

  Future<List<GameCardData>> getCurrentPageCards() async {
    try {
      final carouselRequest =
          await _httpService.fetchCarouselByPage(currentPage);
      carouselState = carouselRequest;
      return carouselRequest.gameCardData;
    } catch (error) {
      print(error);
      throw Exception('getCurrentCards is broken');
    }
  }

  void getNextPageCards() {
    currentPage = currentPage + 1;
  }

  void getPreviousPageCards() {
    currentPage = currentPage - 1;
  }

  bool hasNext() {
    return carouselState.carouselData.hasNext;
  }

  bool hasPrevious() {
    return carouselState.carouselData.hasPrevious;
  }

  bool areGamesAvailable() {
    return carouselState.carouselData.nbOfGames >= 1;
  }
}
