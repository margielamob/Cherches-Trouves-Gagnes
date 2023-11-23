import 'package:app/domain/services/clock_service.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class Clock extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final clockService = Provider.of<ClockService>(context);
    return Row(
      children: [
        Icon(
          Icons.timer,
          color: Colors.black,
          size: 30.0,
        ),
        SizedBox(width: 10),
        Text(
          clockService.timerDisplay,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 30,
          ),
        ),
      ],
    );
  }
}
