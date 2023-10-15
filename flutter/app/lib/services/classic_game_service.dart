import 'package:app/data/game_image_data.dart';
import 'package:app/services/http_service.dart';
import 'package:app/services/image_decoder_service.dart';
import 'package:lzstring/lzstring.dart';
import 'package:get/get.dart';
import 'dart:typed_data';
import 'dart:convert';

class ClassicGameService {
  final HttpService httpService = Get.find();
  final ImageDecoderService imageDecoderService = Get.find();

  Future<Uint8List> decompressImage(String bmpId) async {
    GameImage compressedString = await httpService.fetchGameImage(bmpId);
    String? decompressedString =
        await LZString.decompress(compressedString.content);
    if (decompressedString == null) {
      return base64Decode("");
    }
    decompressedString = "data:image/png;base64,$decompressedString";
    return base64Decode(decompressedString.split(',').last);
  }
}
