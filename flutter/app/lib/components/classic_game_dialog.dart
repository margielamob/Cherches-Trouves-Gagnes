import 'package:app/domain/services/end_game_service.dart';
import 'package:app/pages/game_selection_page.dart';
import 'package:app/pages/reachable_game_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ClassicGameDialog extends StatelessWidget {
  final EndGameService endGameService = Get.find();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Créer ou rejoindre une partie"),
      actions: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FilledButton(
              onPressed: () {
                Navigator.of(context).pop();
                Get.to(GameSelectionPage());
              },
              style: ButtonStyle(
                minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
              ),
              child: Text("Créer"),
            ),
            SizedBox(width: 20),
            FilledButton(
              onPressed: () {
                Navigator.of(context).pop();
                Get.to(ReachableGamePage());
              },
              style: ButtonStyle(
                minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
              ),
              child: Text("Rejoindre"),
            ),
          ],
        ),
        SizedBox(height: 10),
      ],
    );
  }
}
