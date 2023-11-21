import 'package:app/pages/create_game_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class NoGameCard extends StatelessWidget {
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
                height: 70,
                child: Column(
                  children: [
                    Text(
                      "Aucun jeux disponible!",
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
                        Get.off(CreateGamePage());
                      },
                      child: Text("Créer un jeux"),
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
