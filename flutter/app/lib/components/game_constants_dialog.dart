import 'package:app/domain/services/end_game_service.dart';
import 'package:app/pages/game_selection_page.dart';
import 'package:app/pages/reachable_game_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class GameConstantsDialog extends StatelessWidget {
  final EndGameService endGameService = Get.find();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Configure les paramètres de la partie"),
      actions: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FilledButton(
              onPressed: () {
              },
              style: ButtonStyle(
                minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
              ),
              child: Text("Annuler"),
            ),
            SizedBox(width: 20),
            FilledButton(
              onPressed: () {
              },
              style: ButtonStyle(
                minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
              ),
              child: Text("Confirmer"),
            ),
          ],
        ),
        SizedBox(height: 10),
      ],
    );
  }
}
