import 'package:app/domain/models/requests/vignette_created_request.dart';
import 'package:app/domain/services/drawing_service_left.dart';
import 'package:app/domain/services/drawing_service_right.dart';
import 'package:app/domain/services/http_service.dart';
import 'package:app/domain/utils/regex_validation.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class VignetteSubmissionService extends ChangeNotifier {
  final DrawingServiceLeft drawingServiceLeft = Get.find();
  final DrawingServiceRight drawingServiceRight = Get.find();
  final HttpService httpService = Get.find();
  String currentGameName = "";

  List<int>? dataLeftVignette;
  List<int>? dataRightVignette;

  Future<DifferenceVignetteResponse?> getDifferenceImage() async {
    final leftVignette = await drawingServiceLeft.takeSnapShot();
    final rightVignette = await drawingServiceRight.takeSnapShot();
    dataLeftVignette = leftVignette.toList();
    dataRightVignette = rightVignette.toList();
    return await httpService.getDifferenceImage(
        dataLeftVignette!, dataRightVignette!);
  }

  Future<bool> submitNewGame() async {
    if (dataLeftVignette == null ||
        dataRightVignette == null ||
        currentGameName == "") return false;
    final response = await httpService.submitNewGame(
        dataLeftVignette!, dataRightVignette!, currentGameName);
    dataLeftVignette = null;
    dataRightVignette = null;
    return response;
  }

  void changeGameName(String newName) {
    currentGameName = newName;
    notifyListeners();
  }

  bool isGameNameValid() {
    return RegexValidation.isNameValid(currentGameName);
  }
}
