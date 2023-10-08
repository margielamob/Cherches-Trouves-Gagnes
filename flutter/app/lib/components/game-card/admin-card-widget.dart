import 'package:app/components/game-card/admin-card-data.dart';
import 'package:flutter/material.dart';

class AdminCardWidget extends StatelessWidget {
  final AdminCardData data;
  AdminCardWidget({required this.data});

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
              data.title,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Image.network(data.thumbnail),
        ],
      ),
    );
  }
}
