import 'package:app/domain/services/app_bar_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class WaitingPage extends StatelessWidget {
  final GameManagerService gameManagerService = Get.find();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBarService.buildBar(context, 'Waiting Room'),
      body: Center(
          child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            "En attente d'autre joueur...",
            style: TextStyle(fontSize: 20),
          ),
          SizedBox(height: 20),
          CircularProgressIndicator(),
          SizedBox(height: 20),
          TextButton(
              onPressed: () {},
              style: ButtonStyle(
                      alignment: Alignment.center,
                      minimumSize:
                          MaterialStateProperty.all<Size>(Size(300, 50)))
                  .copyWith(
                      backgroundColor: MaterialStateProperty.all<Color>(
                          Theme.of(context).primaryColor),
                      foregroundColor:
                          MaterialStateProperty.all<Color>(Colors.white)),
              child: Text("Lancer la partie")),
        ],
      )),
    );
  }
}
