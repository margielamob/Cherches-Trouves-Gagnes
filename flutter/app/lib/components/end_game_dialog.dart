import 'package:app/domain/services/end_game_service.dart';
import 'package:app/pages/main_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class EndGameDialog extends StatelessWidget {
  final EndGameService endGameService = Get.find();

  @override
  Widget build(BuildContext context) {
    endGameService.isGameFinished = false;
    return AlertDialog(
      title: Text("Partie terminée"),
      actions: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("${endGameService.END_GAME_MESSAGE}"),
            SizedBox(width: 30),
            FilledButton(
              onPressed: () {
                Get.offAll(MainPage());
              },
              style: ButtonStyle(
                minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
              ),
              child: Text("Quitter la page"),
            ),
            SizedBox(width: 30),
          ],
        ),
      ],
    );
  }
}
