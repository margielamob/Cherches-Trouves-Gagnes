import 'package:app/pages/game_selection_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class NoGameReachable extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Card(
            shadowColor: Color.fromARGB(255, 46, 46, 46),
            margin: EdgeInsets.all(8.0),
            child: Padding(
              padding: EdgeInsets.all(8.0),
              child: SizedBox(
                width: 400,
                height: 90,
                child: Column(
                  children: [
                    Text(
                      "Aucun jeux joignable!",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 20),
                    FilledButton(
                      style: ButtonStyle(
                        minimumSize:
                            MaterialStateProperty.all(Size(100.0, 40.0)),
                      ),
                      onPressed: () {
                        Get.to(GameSelectionPage());
                      },
                      child: Text("Créer un jeux classique"),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ])
      ],
    );
  }
}
