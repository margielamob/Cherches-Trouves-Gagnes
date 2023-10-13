import 'package:app/components/game-card/admin-card-data.dart';
import 'package:app/events/card-deleted-event.dart';
import 'package:app/services/card-service.dart';
import 'package:app/services/image-service.dart';
import 'package:event_bus/event_bus.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';

class AdminCardWidget extends StatelessWidget {
  final AdminCardData data;
  final CardService cardService = GetIt.I.get<CardService>();
  final EventBus eventBus = GetIt.I.get<EventBus>();
  final imageService = ImageService();

  AdminCardWidget({required this.data});

  AlertDialog buildDialog(BuildContext context) {
    return AlertDialog(
      title: Text("Confirmation de suppression"),
      content: Text("Êtes-vous sûr de vouloir supprimer ce jeu?"),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: Text("Annuler"),
        ),
        TextButton(
          onPressed: () {
            cardService.deleteCardById(data.id);
            eventBus.fire(CardDeletedEvent(cardId: data.id));
            Navigator.of(context).pop();
          },
          child: Text("Supprimer"),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.all(8.0),
      child: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: const Color.fromARGB(255, 223, 222, 222),
              offset: Offset(0, 2),
              blurRadius: 1,
              spreadRadius: 0,
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Padding(
              padding: EdgeInsets.all(8.0),
              child: Text(
                data.title,
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            Padding(
              padding: EdgeInsets.all(8.0),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(10.0),
                child: Image.network(data.thumbnail),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton.icon(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (BuildContext context) {
                        return buildDialog(context);
                      },
                    );
                  },
                  icon: Icon(Icons.delete),
                  label: Text("Supprimer"),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
