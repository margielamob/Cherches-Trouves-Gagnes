import 'package:flutter/material.dart';

class ExampleState {
  int counter = 0;
}

class ExampleService extends ChangeNotifier {
  ExampleState state = ExampleState();

  incrementCounter() {
    state.counter++;
    notifyListeners();
  }

  decrementCounter() {
    state.counter--;
    notifyListeners();
  }
}
