import 'package:app/components/carousel.dart';
import 'package:app/components/custom_app_bar.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:get/get.dart';

class GameSelectionPage extends StatelessWidget {
  final CarouselService service = Get.find();
  final GameManagerService gameManagerService = Get.find();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar.buildLogoutOnly(
          context, AppLocalizations.of(context)!.selectPageTitle),
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
