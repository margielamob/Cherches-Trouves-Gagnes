import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
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
  int selectedNumber = 200;
  bool checkboxValue = true;
  @override
  Widget build(BuildContext context) {
    final gameManager = Provider.of<GameManagerService>(context);
    return AlertDialog(
      title: Text("Configure les paramètres de la partie"),
      content: Column(
        children: [
          // Number input
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Sélectionnez un nombre :"),
              SizedBox(
                width: 100,
                child: TextField(
                  keyboardType: TextInputType.number,
                  onChanged: (value) {
                    selectedNumber = int.tryParse(value) ?? selectedNumber;
                  },
                  decoration: InputDecoration(
                    hintText: "10",
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 10),
        ],
      ),
      actions: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FilledButton(
              onPressed: () {},
              style: ButtonStyle(
                minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
              ),
              child: Text("Annuler"),
            ),
            SizedBox(width: 20),
            FilledButton(
              onPressed: () {
                gameManager.createMultiplayerGame(widget.data.id, true, 100);
                gameManager.currentGameId = widget.data.id;
                gameManager.gameCards = widget.data;
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
