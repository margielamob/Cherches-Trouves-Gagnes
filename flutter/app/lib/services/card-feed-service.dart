import 'package:app/components/game-card/admin-card-data.dart';
import 'package:app/services/http-client-service.dart';
import 'package:get/get.dart';

class CardFeedService {
  int _currentPage = 0;
  bool _isFetchingCards = false;
  List<AdminCardData> _currentCards = [];
  final HttpClientService _httpClientService = Get.find();

  Future<void> fetchCards() async {
    _isFetchingCards = true;
    try {
      final cards = await _httpClientService.fetchRawCardsByPage(_currentPage);
      _currentCards =
          cards.map((jsonCard) => AdminCardData.fromJson(jsonCard)).toList();
      _isFetchingCards = false;
      _currentPage++;
    } catch (error) {
      print(error);
      throw Exception('could not load and parse cards');
    }
  }

  bool isFetching() {
    return _isFetchingCards;
  }

  List<AdminCardData> getCurrentCards() {
    return _currentCards;
  }

  int getCurrentPage() {
    return _currentPage;
  }

  void afterScrollDown() {
    _currentPage++;
    fetchCards();
  }
}
