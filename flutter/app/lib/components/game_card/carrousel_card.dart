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
          Padding(
            padding: EdgeInsets.all(8.0),
            child: Text(
              data.title,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Image.network(data.thumbnail),
        ],
      ),
    );
  }
}
