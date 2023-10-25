import 'package:image_picker/image_picker.dart';

pickImage(ImageSource source) async {
  final ImagePicker _picker = ImagePicker();
  XFile? _image = await _picker.pickImage(source: source);
  if (_image != null) {
    return await _image.readAsBytes();
  }
}
