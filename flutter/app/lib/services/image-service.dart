import 'dart:convert';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:flutter/material.dart'; // for Flutter UI

class ImageService {
  Image imageFromBase64UTF16(String base64EncodedData) {
    Uint8List binaryData = Uint8List.fromList(base64.decode(base64EncodedData));
    String utf16Data = _utf16le(binaryData);
    List<int> decompressedData = _decompressZlib(utf16Data.codeUnits);

    return Image.memory(Uint8List.fromList(decompressedData));
  }

  String _utf16le(Uint8List utf16Data) {
    final ByteData byteData =
        ByteData.sublistView(Uint16List.fromList(utf16Data));
    return utf8.decode(byteData.buffer.asUint8List());
  }

  List<int> _decompressZlib(List<int> compressedData) {
    Archive archive = TarDecoder().decodeBytes(compressedData);
    ArchiveFile file = archive[0];
    return file.content as List<int>;
  }
}
