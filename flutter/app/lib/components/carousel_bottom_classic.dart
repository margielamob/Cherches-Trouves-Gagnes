import 'package:app/domain/models/game_card_model.dart';
import 'package:flutter/material.dart';

class CarouselBottomClassic extends StatelessWidget {
  final GameCardModel data;
  const CarouselBottomClassic({required this.data});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(0.0, 8.0, 0.0, 0.0),
      child: Row(
        children: [
          FilledButton(
            onPressed: () {
              // TODO: Change this to look like heavy client.
              Navigator.pushNamed(context, "/classic");
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Text("Joindre"),
              ],
            ),
          )
        ],
      ),
    );
  }
}
