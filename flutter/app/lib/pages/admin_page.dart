import 'package:app/domain/services/app_bar_service.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:app/pages/carousel_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class AdminPage extends StatelessWidget {
  final CarouselService service = Get.find();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBarService.buildBar(
        context,
        'Administration',
      ),
      body: Carousel(),
    );
  }
}
