import 'dart:async';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:image_picker/image_picker.dart';

class ImageSelectionService {
  XFile? selectedImage;

  Future<ui.Image?> selectImage() async {
    selectedImage = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (selectedImage == null) return null;
    Uint8List bytes = await selectedImage!.readAsBytes();

    return decodeImageFromList(bytes);
  }
}

Future<ui.Image> decodeImageFromList(Uint8List list) {
  final Completer<ui.Image> completer = Completer<ui.Image>();
  ui.decodeImageFromList(list, (ui.Image img) {
    completer.complete(img);
  });
  return completer.future;
}
