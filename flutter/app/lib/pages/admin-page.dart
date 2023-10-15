import 'package:app/components/card-feed/card-feed.dart';
import 'package:app/services/app-bar-service.dart';
import 'package:app/services/card-feed-service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class AdminPage extends StatelessWidget {
  final CardFeedService service = Get.find();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBarService.buildBar(
        context,
        'Administration',
      ),
      body: CardFeed(),
    );
  }
}
