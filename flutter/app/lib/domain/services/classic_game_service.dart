import 'package:app/domain/models/game_image_model.dart';
import 'package:app/domain/models/vignettes_model.dart';
import 'package:app/domain/services/http_service.dart';
import 'package:lzstring/lzstring.dart';
import 'package:get/get.dart';
import 'dart:typed_data';
import 'dart:convert';
import 'dart:ui' as ui;

class ClassicGameService {
  final HttpService httpService = Get.find();

  Future<Uint8List> decompressImage(String bmpId) async {
    GameImageModel compressedString = await httpService.fetchGameImage(bmpId);
    String? decompressedString =
        await LZString.decompressFromUTF16(compressedString.content);

    if (decompressedString == null) {
      return base64Decode("");
    }
    return base64Decode(decompressedString);
  }

  Future<ui.Image> convertFromUint8ListToImage(Uint8List imageToConvert) async {
    final codec = await ui.instantiateImageCodec(imageToConvert);
    final frameInfo = await codec.getNextFrame();
    final ui.Image uiImage = frameInfo.image;
    return uiImage;
  }

  Future<ui.Image> getImageFromId(String bmpId) async {
    final imageList = await decompressImage(bmpId);
    final uiImage = convertFromUint8ListToImage(imageList);
    return uiImage;
  }

  Future<VignettesModel> getImagesFromIds(
      String bmpOriginal, String bmpModified) async {
    final original = await getImageFromId(bmpOriginal);
    final modified = await getImageFromId(bmpModified);
    return VignettesModel(original: original, modified: modified);
  }
}
