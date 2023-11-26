import 'dart:convert';

import 'package:app/domain/utils/base_url.dart';

class PublishNewVignetteRequest {
  String name;
  List<int> leftImage;
  List<int> rightImage;
  Uri url = Uri.parse('${BaseURL.httpServer}/game/card/');
  Map<String, String> header = <String, String>{
    'Content-Type': 'application/json; charset=UTF-8',
  };

  PublishNewVignetteRequest(
      {required this.leftImage, required this.rightImage, required this.name});

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
      'name': name,
    };
  }

  String body() {
    final requestString = _toJson();
    return json.encode(requestString);
  }
}
