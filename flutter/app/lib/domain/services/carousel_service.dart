import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/models/requests/carousel_request.dart';
import 'package:app/domain/services/http_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CarouselState {
  int currentPage = 1;
}

class CarouselService extends ChangeNotifier {
  CarouselState state = CarouselState();

  CarouselRequest? carouselState;
  final HttpService _httpService;

  CarouselService() : _httpService = Get.find() {
    getCurrentPageCards();
  }

  Future<List<GameCardModel>> getCurrentPageCards() async {
    try {
      final carouselRequest =
          await _httpService.fetchCarouselByPage(state.currentPage);
      carouselState = carouselRequest;
      return carouselRequest.gameCardData;
    } catch (error) {
      print(error);
      throw Exception('Error fetching cards');
    }
  }

  void getNextPageCards() {
    state.currentPage++;
    notifyListeners();
  }

  void getPreviousPageCards() {
    state.currentPage--;
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
