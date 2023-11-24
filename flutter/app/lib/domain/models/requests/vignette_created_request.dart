/*
  Future<ui.Image> toImage() async {
    final codec = await ui.instantiateImageCodec(data.buffer.asUint8List());
    final frameInfo = await codec.getNextFrame();
    return frameInfo.image;
  }
  */
import 'dart:convert';
import 'dart:typed_data';

class VignetteCreatedRequest {
  int numberDifference;
  int width;
  int height;
  List<int> data;

  VignetteCreatedRequest(
      {required this.numberDifference,
      required this.width,
      required this.height,
      required this.data});

  factory VignetteCreatedRequest.fromJson(Map<String, dynamic> json) {
    return VignetteCreatedRequest(
      numberDifference: json['numberDifference'],
      width: json['width'],
      height: json['height'],
      data: List<int>.from(json['data'] as List),
    );
  }
}

/*

.send({
                    nbDifferences: numberDifference,
                    differenceImage: differenceImageBase64,
                });
*/

class DifferenceVignetteResponse {
  int statusCode;
  int? nbDifference;
  Uint8List? differenceImage;

  DifferenceVignetteResponse(
      {required this.statusCode, this.nbDifference, this.differenceImage});

  factory DifferenceVignetteResponse.fromJson(Map<String, dynamic> json) {
    return DifferenceVignetteResponse(
        statusCode: 202,
        nbDifference: json['nbDifferences'],
        differenceImage: base64Decode(json['differenceImage'].split(',').last));
  }
}
