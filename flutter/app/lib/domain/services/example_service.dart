import 'package:app/domain/services/http_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ExampleState {
  int counter = 0;
}

class ExampleService extends ChangeNotifier {
  ExampleState state = ExampleState();
  HttpService httpService = Get.find();

  incrementCounter() {
    state.counter++;
    notifyListeners();
  }

  decrementCounter() {
    state.counter--;
    notifyListeners();
  }
}
