import 'package:app/services/http-client-service.dart';
import 'package:get_it/get_it.dart';

class CardService {
  final _http = GetIt.I.get<HttpClientService>();

  Future<bool> deleteAll() async {
    try {
      return _http.deleteAllCards();
    } catch (error) {
      print(error);
      return false;
    }
  }

  Future<bool> deleteCardById(String id) async {
    try {
      if (id.isNotEmpty) {
        return _http.deleteCardById(id);
      } else {
        throw id;
      }
    } catch (id) {
      print('invalid id: $id');
      return false;
    }
  }
}
