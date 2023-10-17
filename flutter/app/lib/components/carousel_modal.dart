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
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text("Annuler"),
            ),
            SizedBox(width: 30),
            FilledButton(
              style: ElevatedButton.styleFrom(
                backgroundColor:
                    Colors.red, // Set the button's background color to red
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
