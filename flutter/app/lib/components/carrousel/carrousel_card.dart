import 'package:app/data/game_card_data.dart';
import 'package:flutter/material.dart';

class CarrouselCard extends StatelessWidget {
  final GameCardData data;
  CarrouselCard({required this.data, required this.enabled});

  final bool enabled;

  @override
  Widget build(BuildContext context) {
    final VoidCallback? onPressed = enabled ? () {} : null;
    return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Card(
            elevation: 10,
            shadowColor: Colors.grey,
            margin: EdgeInsets.all(8.0),
            child: Padding(
              padding: EdgeInsets.all(8.0),
              child: Column(
                children: [
                  Text(
                    data.title,
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 10),
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
                    ),
                  ),
                  Row(
                    children: [
                      FilledButton(
                        onPressed: onPressed,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: <Widget>[
                            Icon(Icons
                                .arrow_forward), // Add the right arrow icon
                          ],
                        ),
                      )
                    ],
                  ),
                ],
              ),
            ),
          ),
        ]);
  }
}

/*

*/