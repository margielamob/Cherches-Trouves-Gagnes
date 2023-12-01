import 'package:app/components/carousel_card.dart';
import 'package:app/components/no_game_card.dart';
import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class Carousel extends StatelessWidget {
  final GameManagerService gameManagerService = Get.find();
  final bool isCarouselForAdminPage;
  Carousel({required this.isCarouselForAdminPage}) {
    gameManagerService.sendGameRequest();
  }

  Future<List<GameCardModel>> getCards(CarouselService carouselService) async {
    return carouselService.getCurrentPageCards();
  }

  @override
  Widget build(BuildContext context) {
    final carouselService = Provider.of<CarouselService>(context);

    return FutureBuilder<List<GameCardModel>>(
      future: getCards(carouselService),
      builder:
          (BuildContext context, AsyncSnapshot<List<GameCardModel>> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(
            child: CircularProgressIndicator(),
          );
        } else if (snapshot.hasError) {
          return Center(
            child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              Text('Error: ${snapshot.error}'),
              SizedBox(width: 10),
              Icon(Icons.signal_wifi_off),
            ]),
          );
        } else if (!snapshot.hasData) {
          return Text('No data available');
        } else {
          if (snapshot.data!.isEmpty) {
            return Center(
              child: Column(
                children: [
                  SizedBox(height: 30),
                  NoGameCard(),
                ],
              ),
            );
          } else {
            return Column(
              children: [
                Expanded(
                  child: Center(
                    child: ListView.builder(
                      shrinkWrap: true,
                      scrollDirection: Axis.horizontal,
                      itemCount: snapshot.data!.length,
                      itemBuilder: (_, index) {
                        if (snapshot.data != null) {
                          return CarouselCard(
                            data: snapshot.data![index],
                            isAdministrationPage: isCarouselForAdminPage,
                          );
                        } else {
                          return Text("Il n'y a pas de jeux pour le moment!");
                        }
                      },
                    ),
                  ),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: FilledButton(
                        onPressed: carouselService.hasPrevious()
                            ? () {
                                carouselService.getPreviousPageCards();
                              }
                            : null,
                        child: Icon(Icons.arrow_back),
                      ),
                    ),
                    SizedBox(width: 20.0),
                    FilledButton(
                      onPressed: carouselService.hasNext()
                          ? () {
                              carouselService.getNextPageCards();
                            }
                          : null,
                      child: Icon(Icons.arrow_forward),
                    ),
                  ],
                ),
                SizedBox(height: 30),
              ],
            );
          }
        }
      },
    );
  }
}

// Be aware of this error:
// https://docs.flutter.dev/testing/common-errors#:~:text=To%20fix%20this%20error%2C%20specify,height%20using%20a%20Flexible%20widget.