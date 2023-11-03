import 'dart:typed_data';

import 'package:app/domain/models/carousel_model.dart';
import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/models/requests/carousel_request.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:app/domain/services/http_service.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:mockito/mockito.dart';

class MockHttpService extends Mock implements HttpService {
  @override
  Future<CarouselRequest> fetchCarouselByPage(int page) async {
    final carouselModel = CarouselModel(
      currentPage: 1,
      gamesOnPage: 3,
      nbOfGames: 10,
      nbOfPages: 2,
      hasNext: true,
      hasPrevious: false,
    );

    final gameCardModel = GameCardModel(
      id: "1",
      title: "Test Game",
      thumbnail: Uint8List.fromList([]),
      nbDifferences: 4,
      idEditedBmp: "idEdited",
      idOriginalBmp: "idOriginal",
    );

    final carouselRequestModel = CarouselRequest(
      carouselData: carouselModel,
      gameCardData: [gameCardModel],
    );

    return Future.value(carouselRequestModel);
  }
}

void main() {
  group('CarouselService Tests', () {
    setUp(() {
      Get.testMode = true;
      Get.put<HttpService>(MockHttpService());
      Get.put<CarouselService>(CarouselService());
    });

    test('Initial currentPage should be 1', () async {
      final carouselService = Get.find<CarouselService>();
      expect(carouselService.state.currentPage, 1);
    });

    test('getCurrentPageCards should make an httpRequest', () async {
      final carouselService = Get.find<CarouselService>();
      await carouselService.getCurrentPageCards();
      //expect(carouselService.state.currentPage, 1);
    });
  });
}
