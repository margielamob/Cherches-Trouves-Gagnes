import 'package:app/data/carrousel_request_data.dart';
import 'package:app/data/game_card_data.dart';
import 'package:app/services/http_client_service.dart';
import 'package:get_it/get_it.dart';

class CardFeedService {
  int _currentPage = 0;
  List<GameCardData> _currentCards = [];
  final HttpClientService _httpClientService = GetIt.I.get<HttpClientService>();

  Future<List<GameCardData>> getCurrentPageCards() async {
    try {
      final carrouselRequest =
          await _httpClientService.fetchCarrouselByPage(_currentPage);
      return carrouselRequest.gameCardData;
    } catch (error) {
      print(error);
      throw Exception('could not load and parse cards');
    }
  }

  List<GameCardData> getCurrentCards() {
    return _currentCards;
  }

  int getCurrentPage() {
    return _currentPage;
  }
}
