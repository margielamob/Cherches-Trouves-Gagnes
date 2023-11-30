import 'dart:convert';

import 'package:app/domain/services/radius_slider_service.dart';
import 'package:app/domain/utils/base_url.dart';
import 'package:get/get.dart';

class SendNewVignetteRequest {
  final RadiusSliderService radiusManager = Get.find();
  List<int> leftImage;
  List<int> rightImage;
  Uri url = Uri.parse('${BaseURL.httpServer}/game/flutter/card/validation');
  Map<String, String> header = <String, String>{
    'Content-Type': 'application/json; charset=UTF-8',
  };

  SendNewVignetteRequest({required this.leftImage, required this.rightImage});

  Map<String, dynamic> _toJson() {
    return {
      'original': {
        'width': 640,
        'height': 480,
        'data': leftImage,
      },
      'modify': {
        'width': 640,
        'height': 480,
        'data': rightImage,
      },
      'differenceRadius': radiusManager.radiusSlider.getValue(),
      'name': 'newTest',
    };
  }

  String body() {
    final requestString = _toJson();
    return json.encode(requestString);
  }
}
