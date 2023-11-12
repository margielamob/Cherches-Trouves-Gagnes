import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class GameConstantsDialog extends StatefulWidget {
  final GameCardModel data;
  final AuthService authService = Get.find();

  GameConstantsDialog({required this.data});
  @override
  // ignore: library_private_types_in_public_api
  _GameConstantsDialogState createState() => _GameConstantsDialogState();
}

class _GameConstantsDialogState extends State<GameConstantsDialog> {
  int gameTimer = 200;
  bool cheatModeActivated = true;
  @override
  Widget build(BuildContext context) {
    final gameManager = Provider.of<GameManagerService>(context);
    return AlertDialog(
      title: Text("Configure les paramètres de la partie"),
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
                    gameManager.createMultiplayerGame(
                        widget.data.id, cheatModeActivated, gameTimer);
                    gameManager.currentGameId = widget.data.id;
                    gameManager.gameCards = widget.data;
                    Navigator.of(context).pop();
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
