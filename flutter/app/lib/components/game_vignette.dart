import 'package:app/domain/models/vignettes_model.dart';
import 'package:flutter/material.dart';

abstract class GameVignette extends StatelessWidget {
  final VignettesModel images;
  final bool isModifiedVignette;

  GameVignette(this.isModifiedVignette, this.images);
}
