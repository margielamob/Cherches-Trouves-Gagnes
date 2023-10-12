import 'package:app/events/card-selection-deleted-event.dart';
import 'package:app/services/http-client-service.dart';
import 'package:event_bus/event_bus.dart';
import 'package:get_it/get_it.dart';

class CardService {
  final _http = GetIt.I.get<HttpClientService>();
  final Set<String> _selection = {};
  final _eventBus = GetIt.I.get<EventBus>();

  void selectCard(String id) {
    _selection.add(id);
  }

  void unselectCard(String id) {
    _selection.remove(id);
  }

  Future<bool> deleteSelection() async {
    try {
      if (_selection.isNotEmpty) {
        _eventBus.fire(CardSelectionDeletedEvent(cardIds: _selection));
        return _http.deleteCardSelection(_selection);
      } else {
        throw _selection;
      }
    } catch (selection) {
      print(selection);
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
