import 'dart:ui' as ui;

class VignettesModel {
  final ui.Image modified;
  final ui.Image original;

  const VignettesModel({
    required this.original,
    required this.modified,
  });
}
