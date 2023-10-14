import 'package:app/components/carrousel/carrousel.dart';
import 'package:app/services/app_bar_service.dart';
import 'package:app/services/card_feed_service.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';

class AdminPage extends StatelessWidget {
  final service = GetIt.I.get<CardFeedService>();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBarService.buildBar(
        context,
        'Administration',
      ),
      body: Carrousel(),
    );
  }
}
