import 'package:app/data/carrousel_request_data.dart';
import 'package:app/data/game_card_data.dart';
import 'package:app/services/http_client_service.dart';
import 'package:get_it/get_it.dart';

class CardFeedService {
  late CarrouselRequestData carrouselState;
  final HttpClientService _httpClientService = GetIt.I.get<HttpClientService>();

  Future<List<GameCardData>> getCurrentPageCards() async {
    try {
      final carrouselRequest = await _httpClientService.fetchCarrouselByPage(0);
      carrouselState = carrouselRequest;
      return carrouselRequest.gameCardData;
    } catch (error) {
      print(error);
      throw Exception('could not load and parse cards');
    }
  }

  bool hasNext() {
    return carrouselState.carrouselData.hasNext;
  }

  bool hasPrevious() {
    return carrouselState.carrouselData.hasPrevious;
  }
}
