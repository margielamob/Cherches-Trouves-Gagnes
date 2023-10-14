import 'package:app/data/carrousel_request_data.dart';
import 'package:app/data/game_card_data.dart';
import 'package:app/services/http_client_service.dart';
import 'package:get_it/get_it.dart';

class CardFeedService {
  int currentPage = 1;
  late CarrouselRequestData carrouselState;
  final HttpClientService _httpClientService;

  CardFeedService() : _httpClientService = GetIt.I.get<HttpClientService>();

  Future<List<GameCardData>> getCurrentPageCards() async {
    try {
      final carrouselRequest =
          await _httpClientService.fetchCarrouselByPage(currentPage);
      carrouselState = carrouselRequest;
      return carrouselRequest.gameCardData;
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
    return carrouselState.carrouselData.hasNext;
  }

  bool hasPrevious() {
    return carrouselState.carrouselData.hasPrevious;
  }
}
