import 'package:app/domain/services/app_bar_service.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:app/components/carousel.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class GameSelectionPage extends StatelessWidget {
  final CarouselService service = Get.find();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBarService.buildBar(
        context,
        'Page de sélection de vignettes',
      ),
      body: Column(
        children: [
          SizedBox(height: 30),
          Expanded(
            child: Carousel(isCarouselForAdminPage: false),
          ),
        ],
      ),
    );
  }
}
