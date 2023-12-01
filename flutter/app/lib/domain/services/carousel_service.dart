import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/models/requests/carousel_request.dart';
import 'package:app/domain/services/http_service.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CarouselService extends ChangeNotifier {
  final SocketService _socket = Get.find();
  int currentPage = 1;

  CarouselRequest? carouselState;
  final HttpService _httpService;

  CarouselService() : _httpService = Get.find() {
    handleSockets();
  }

  void handleSockets() {
    _socket.on(SocketEvent.refreshGames, (dynamic message) {
      notifyListeners();
      // TODO: afficher un snakBar pour dire qu'on update les jeux
    });
  }

  Future<List<GameCardModel>> getCurrentPageCards() async {
    final carouselRequest = await _httpService.fetchCarouselByPage(currentPage);
    carouselState = carouselRequest;
    return carouselRequest.gameCardData;
  }

  void getNextPageCards() {
    currentPage++;
    notifyListeners();
  }

  void getPreviousPageCards() {
    currentPage--;
    notifyListeners();
  }

  bool hasNext() {
    return carouselState!.carouselData.hasNext;
  }

  bool hasPrevious() {
    return carouselState!.carouselData.hasPrevious;
  }

  bool areGamesAvailable() {
    if (carouselState != null) {
      return carouselState!.carouselData.nbOfGames >= 1;
    }
    return false;
  }

  Future<bool> deleteAll() async {
    try {
      final result = await _httpService.deleteAllCards();
      notifyListeners();
      return result;
    } catch (error) {
      print(error);
      return false;
    }
  }

  Future<bool> deleteCardById(String id) async {
    try {
      if (id.isNotEmpty) {
        notifyListeners();
        final result = await _httpService.deleteCardById(id);
        return result;
      } else {
        throw id;
      }
    } catch (id) {
      print('invalid id: $id');
      return false;
    }
  }
}
