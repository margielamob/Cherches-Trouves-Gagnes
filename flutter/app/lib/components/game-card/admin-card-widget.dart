import 'package:app/components/game-card/admin-card-data.dart';
import 'package:app/events/card-deleted-event.dart';
import 'package:app/services/card-service.dart';
import 'package:event_bus/event_bus.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';

class AdminCardWidget extends StatefulWidget {
  final AdminCardData data;
  AdminCardWidget({required this.data});

  final cardService = GetIt.I.get<CardService>();

  @override
  AdminCardWidgetState createState() => AdminCardWidgetState();
}

class AdminCardWidgetState extends State<AdminCardWidget> {
  bool isSelectButtonEnabled = true;
  final eventBus = GetIt.I.get<EventBus>();

  AlertDialog buildDialog(context) {
    return AlertDialog(
      title: Text("Delete Confirmation"),
      content: Text("Are you sure you want to delete this card?"),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: Text("Cancel"),
        ),
        TextButton(
          onPressed: () {
            widget.cardService.deleteCardById(widget.data.id);
            eventBus.fire(CardDeletedEvent(cardId: widget.data.id));
            Navigator.of(context).pop();
          },
          child: Text("Delete"),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.all(8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Padding(
            padding: EdgeInsets.all(8.0),
            child: Text(
              widget.data.title,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.all(8.0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(10.0), // Rounded corners
              child: Image.network(widget.data.thumbnail),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton.icon(
                onPressed: () {
                  widget.cardService.selectCard(widget.data.id);
                  setState(() {
                    isSelectButtonEnabled = !isSelectButtonEnabled;
                  });
                },
                icon: isSelectButtonEnabled
                    ? Icon(Icons.circle_outlined)
                    : Icon(Icons.check_circle_outline), // Select icon
                label: Text("Select"),
                style: ButtonStyle(
                  backgroundColor: MaterialStateProperty.resolveWith<Color>(
                    (Set<MaterialState> states) {
                      if (!isSelectButtonEnabled) {
                        return Colors.grey;
                      }
                      return Colors.deepPurple;
                    },
                  ),
                ),
              ),
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
                label: Text("Delete"),
              ),
            ],
          )
        ],
      ),
    );
  }
}
