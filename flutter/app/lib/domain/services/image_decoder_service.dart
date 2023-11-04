import 'dart:async';

import 'package:lzstring/lzstring.dart';

class ImageDecoderService {
  Future<String?> decompressImage(String compressedString) async {
    return LZString.decompress(compressedString);
  }
}
