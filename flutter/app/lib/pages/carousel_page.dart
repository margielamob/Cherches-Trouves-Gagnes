import 'package:app/components/carousel_card.dart';
import 'package:app/components/carousel_modal.dart';
import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class Carousel extends StatelessWidget {
  final bool enabled = false;

  @override
  Widget build(BuildContext context) {
    final carouselService = Provider.of<CarouselService>(context);

    final VoidCallback? onPressed = enabled ? () {} : null;
    return FutureBuilder<List<GameCardModel>>(
      future: carouselService.getCurrentPageCards(),
      builder:
          (BuildContext context, AsyncSnapshot<List<GameCardModel>> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(
            child: CircularProgressIndicator(),
          );
        } else if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        } else if (!snapshot.hasData) {
          return Text('No data available');
        } else {
          return Column(
            children: [
              Padding(
                padding: EdgeInsets.all(20.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    FilledButton(
                      onPressed: onPressed,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          Text("Créer un jeux"),
                          SizedBox(width: 2.0),
                          Icon(Icons.create),
                        ],
                      ),
                    ),
                    SizedBox(width: 10.0),
                    FilledButton(
                      onPressed: carouselService.areGamesAvailable()
                          ? () {
                              showDialog(
                                context: context,
                                builder: (BuildContext context) {
                                  return CarouselModal(
                                    verification:
                                        "Voulez-vous vraiment supprimer tous les jeux?",
                                    isAllGames: true,
                                  );
                                },
                              );
                            }
                          : null,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          Text("Supprimer tous les jeux"),
                          SizedBox(width: 2.0),
                          Icon(Icons.delete),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Center(
                  child: ListView.builder(
                    shrinkWrap: true,
                    scrollDirection: Axis.horizontal,
                    itemCount: snapshot.data!.length,
                    itemBuilder: (_, index) {
                      if (snapshot.data != null) {
                        return CarouselCard(data: snapshot.data![index]);
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
      },
    );
  }
}

// Be aware of this error:
// https://docs.flutter.dev/testing/common-errors#:~:text=To%20fix%20this%20error%2C%20specify,height%20using%20a%20Flexible%20widget.
