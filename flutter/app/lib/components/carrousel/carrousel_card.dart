import 'package:app/data/game_card_data.dart';
import 'package:flutter/material.dart';

class CarrouselCard extends StatelessWidget {
  final GameCardData data;
  CarrouselCard({required this.data});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.all(8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            data.title,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          Container(
              decoration: BoxDecoration(
                border: Border.all(
                  color: Colors.black,
                  width: 1.0,
                ),
              ),
              child: SizedBox(
                width: 320,
                height: 240,
                child: Image.network(
                  data.thumbnail,
                  fit: BoxFit.cover,
                ),
              )),
        ],
      ),
    );
  }
}
