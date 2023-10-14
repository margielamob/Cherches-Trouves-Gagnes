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
  final feedService = GetIt.I.get<CardFeedService>();

  Future<List<GameCardData>> getCurrentPageCards() {
    return feedService.getCurrentPageCards();
  }

  final bool enabled = true;

  @override
  Widget build(BuildContext context) {
    final VoidCallback? onPressed = enabled ? () {} : null;
    return FutureBuilder<List<GameCardData>>(
      future: getCurrentPageCards(),
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
                  children: [
                    FilledButton(
                      onPressed: onPressed,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          Text("Supprimer tous les jeux"),
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
              )
            ],
          );
        }
      },
    );
  }
}

// TODO: Afficher une carte correctement.

/*

Column(
            children: [
              Expanded(
                child: RefreshIndicator(
                  key: _refreshKey,
                  onRefresh: _handleRefresh,
                  child: GridView.builder(
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 8.0,
                      mainAxisSpacing: 8.0,
                    ),
                    itemCount: currentCards.length,
                    itemBuilder: (context, index) {
                      return CarrouselCard(data: currentCards[index]);
                    },
                  ),
                ),
              ),
              GestureDetector(
                child: Center(
                  child: Icon(
                    Icons.keyboard_arrow_down,
                    size: 48,
                    color: Colors.deepPurple.withOpacity(0.8),
                  ),
                ),
                onTap: () {},
              )
            ],
          );

*/
// I hate this error
// https://docs.flutter.dev/testing/common-errors#:~:text=To%20fix%20this%20error%2C%20specify,height%20using%20a%20Flexible%20widget.
