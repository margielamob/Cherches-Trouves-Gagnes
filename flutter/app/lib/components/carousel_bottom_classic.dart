import 'package:app/components/carousel_bottom.dart';
import 'package:app/domain/models/game_card_model.dart';
import 'package:flutter/material.dart';

class CarouselBottomClassic extends CarouselBottom {
  CarouselBottomClassic(GameCardModel data) : super(data: data);

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
