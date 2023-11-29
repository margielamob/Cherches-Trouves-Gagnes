import 'package:app/components/limited_constants_dialog.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/utils/game_mode.dart';
import 'package:app/pages/game_selection_page.dart';
import 'package:app/pages/observableGamePage.dart';
import 'package:app/pages/reachable_game_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ClassicGameDialog extends StatelessWidget {
  final GameManagerService gameManagerService = Get.find();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Créer, rejoindre ou observer une partie"),
      actions: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FilledButton(
              onPressed: () {
                if (gameManagerService.gameMode?.value ==
                    AvailableGameMode.classic) {
                  Navigator.of(context).pop();
                  Get.to(GameSelectionPage());
                } else if (gameManagerService.gameMode?.value ==
                    AvailableGameMode.limited) {
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return LimitedConstantsDialog();
                    },
                  );
                }
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
            SizedBox(width: 20),
            FilledButton(
              onPressed: () {
                Navigator.of(context).pop();
                Get.to(ObservableGamePage());
              },
              style: ButtonStyle(
                minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
              ),
              child: Text("Observer"),
            ),
          ],
        ),
        SizedBox(height: 10),
      ],
    );
  }
}
