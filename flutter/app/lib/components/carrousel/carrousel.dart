import 'package:app/components/carrousel/carrousel_card.dart';
import 'package:app/data/game_card_data.dart';
import 'package:app/services/card_feed_service.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';

class Carrousel extends StatefulWidget {
  const Carrousel({super.key});

  @override
  State<Carrousel> createState() => _CarrouselState();
}

class _CarrouselState extends State<Carrousel> {
  final cardFeedService = GetIt.I.get<CardFeedService>();

  final bool enabled = true;

  @override
  Widget build(BuildContext context) {
    final VoidCallback? onPressed = enabled ? () {} : null;
    return FutureBuilder<List<GameCardData>>(
      future: cardFeedService.getCurrentPageCards(),
      builder:
          (BuildContext context, AsyncSnapshot<List<GameCardData>> snapshot) {
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
                      onPressed: onPressed,
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
                        return CarrouselCard(data: snapshot.data![index]);
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
                      onPressed: cardFeedService.hasPrevious()
                          ? () {
                              cardFeedService.getPreviousPageCards();
                              setState(() {});
                            }
                          : null,
                      child: Icon(Icons.arrow_back),
                    ),
                  ),
                  SizedBox(width: 20.0),
                  FilledButton(
                    onPressed: cardFeedService.hasNext()
                        ? () {
                            cardFeedService.getNextPageCards();
                            setState(() {});
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
