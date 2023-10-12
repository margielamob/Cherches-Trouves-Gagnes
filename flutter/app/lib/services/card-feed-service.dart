import 'package:app/components/game-card/admin-card-data.dart';
import 'package:app/services/http-client-service.dart';
import 'package:get_it/get_it.dart';

class CardFeedService {
  int _currentPage = 1;
  bool _isFetchingCards = false;
  List<AdminCardData> _currentCards = [];
  final HttpClientService _httpClientService = GetIt.I.get<HttpClientService>();
  late bool hasNext;

  Future<void> fetchCards() async {
    print(_currentPage);
    _currentCards.clear();
    _isFetchingCards = true;
    try {
      final response =
          await _httpClientService.fetchRawCardsByPage(_currentPage);
      for (final obj in response['list']) {
        _currentCards.add(AdminCardData.fromJson(obj));
      }
      hasNext = response['hasNext'];
      _isFetchingCards = false;
      if (hasNext) {
        _currentPage++;
      }
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

  void reset() {
    _currentPage = 0;
    _currentCards = [];
  }
}
