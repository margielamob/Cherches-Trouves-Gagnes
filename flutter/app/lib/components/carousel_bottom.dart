import 'package:app/domain/models/game_card_model.dart';
import 'package:flutter/material.dart';

abstract class CarouselBottom extends StatelessWidget {
  final GameCardModel data;
  const CarouselBottom({required this.data});
}
