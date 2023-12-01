import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:get/get.dart';

class LimitedConstantsDialog extends StatefulWidget {
  final GameManagerService gameManagerService = Get.find();

  @override
  // ignore: library_private_types_in_public_api
  _LimitedConstantsDialogState createState() => _LimitedConstantsDialogState();
}

class _LimitedConstantsDialogState extends State<LimitedConstantsDialog> {
  int gameTimer = 200;
  int timeBonus = 10;
  bool cheatModeActivated = true;
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(AppLocalizations.of(context)!.limitedDialogTitle),
      actions: <Widget>[
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("Durée de la partie (secondes) :"),
            SizedBox(
              width: 50,
              child: TextField(
                keyboardType: TextInputType.number,
                onChanged: (value) {
                  gameTimer = int.tryParse(value) ?? gameTimer;
                  setState(() {
                    gameTimer = gameTimer < 10 ? 10 : gameTimer;
                  });
                },
                inputFormatters: [
                  FilteringTextInputFormatter.allow(RegExp(r'^\d+')),
                  FilteringTextInputFormatter.deny(RegExp(r'^[0]{2,}')),
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(4),
                ],
                decoration: InputDecoration(
                  hintText: "200",
                ),
              ),
            ),
            SizedBox(height: 10),
            Text("Temps bonus (secondes) :"),
            SizedBox(
              width: 50,
              child: TextField(
                keyboardType: TextInputType.number,
                onChanged: (value) {
                  timeBonus = int.tryParse(value) ?? timeBonus;
                  setState(() {
                    timeBonus = timeBonus < 0 ? 0 : timeBonus;
                  });
                },
                inputFormatters: [
                  FilteringTextInputFormatter.allow(RegExp(r'^\d+')),
                  FilteringTextInputFormatter.deny(RegExp(r'^[0]{2,}')),
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(2),
                ],
                decoration: InputDecoration(
                  hintText: "10",
                ),
              ),
            ),
            SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text("Activer le cheat mode :"),
                Checkbox(
                  value: cheatModeActivated,
                  onChanged: (value) {
                    setState(() {
                      cheatModeActivated = value ?? cheatModeActivated;
                    });
                  },
                ),
              ],
            ),
            SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                FilledButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  style: ButtonStyle(
                    minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
                  ),
                  child: Text("Annuler"),
                ),
                SizedBox(width: 20),
                FilledButton(
                  onPressed: () {
                    widget.gameManagerService.createLimitedGame(
                        gameTimer, timeBonus, cheatModeActivated);
                  },
                  style: ButtonStyle(
                    minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
                  ),
                  child: Text("Confirmer"),
                ),
              ],
            ),
          ],
        ),
        SizedBox(height: 10),
      ],
    );
  }
}
