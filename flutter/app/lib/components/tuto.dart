import 'package:flutter/material.dart';

class Button extends StatefulWidget {
  const Button({super.key});

  @override
  State<Button> createState() => _ButtonState();
}

class _ButtonState extends State<Button> {
  int count = 0;

  void increment() {
    setState(() {
      count++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Row(children: [
      Container(
        width: 100,
        height: 100,
        decoration: BoxDecoration(
          border: Border.all(
              width: 3, color: Colors.deepPurple, style: BorderStyle.solid),
        ),
        child: Text(
          '$count',
        ),
      ),
      SizedBox(
        width: 10,
      ),
      ElevatedButton(
          onPressed: () {
            increment();
          },
          child: Icon(
            Icons.add,
          )),
    ]);
  }
}
