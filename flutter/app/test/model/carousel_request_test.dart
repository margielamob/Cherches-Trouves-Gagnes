import 'package:app/domain/models/requests/carousel_request.dart';
import 'package:flutter_test/flutter_test.dart';

import 'carousel_request_test.data.dart';

void main() {
  group('CarouselRequestModel Tests', () {
    test('Should create the proper carouselData with fromJson', () {
      final rawJson = carouselInfoJson;
      CarouselRequest carousel = CarouselRequest.fromJson(rawJson);
      expect(carousel.carouselData.currentPage, 1);
      expect(carousel.carouselData.gamesOnPage, 4);
      expect(carousel.carouselData.nbOfGames, 5);
      expect(carousel.carouselData.nbOfPages, 2);
      expect(carousel.carouselData.hasNext, true);
      expect(carousel.carouselData.hasPrevious, false);
    });

    test('Should create the proper carouselData with fromJson', () {
      final rawJson = carouselInfoJson;
      CarouselRequest carousel = CarouselRequest.fromJson(rawJson);
      expect(carousel.gameCardData.length, 4);
      final firstGame = carousel.gameCardData[0];
      expect(firstGame.id, "97b430aa-fcd3-451c-8118-18a5e9b18636");
      expect(firstGame.title, "saoulGame");
      expect(firstGame.thumbnail.length, 921654);
      expect(firstGame.nbDifferences, 3);
      expect(firstGame.idEditedBmp, "db0f9c65-36aa-4ceb-81a8-364774c1bb5b");
      expect(firstGame.idOriginalBmp, "8a5c25fa-ddea-4c51-a38c-9bdc97979969");
    });
  });
}
