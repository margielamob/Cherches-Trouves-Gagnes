import 'package:app/domain/services/carousel_service.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class CarouselModal extends StatelessWidget {
  CarouselModal({required this.verification, this.gameId, this.isAllGames});
  final String verification;
  final String? gameId;
  final bool? isAllGames;

  @override
  Widget build(BuildContext context) {
    final carouselService = Provider.of<CarouselService>(context);

    return AlertDialog(
      title: Text(verification),
      actions: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FilledButton(
              style: ButtonStyle(
                minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
              ),
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text("Annuler"),
            ),
            SizedBox(width: 30),
            FilledButton(
              style: ButtonStyle(
                minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
                backgroundColor: MaterialStateProperty.all(Colors.red),
              ),
              onPressed: () {
                Navigator.of(context).pop();
                if (isAllGames != null && isAllGames == true) {
                  carouselService.deleteAll();
                } else if (gameId != null) {
                  carouselService.deleteCardById(gameId!);
                }
              },
              child: Text("Supprimer", style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      ],
    );
  }
}
