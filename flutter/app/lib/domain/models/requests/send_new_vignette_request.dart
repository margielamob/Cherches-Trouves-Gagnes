import 'dart:convert';

import 'package:app/domain/utils/base_url.dart';

class SendNewVignetteRequest {
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
      'differenceRadius': 3,
      'name': 'newTest',
    };
  }

  String body() {
    final requestString = _toJson();
    return json.encode(requestString);
  }
}
