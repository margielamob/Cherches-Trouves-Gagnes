import 'dart:async';

import 'package:app/components/carousel.dart';
import 'package:app/components/chat/chat_panel.dart';
import 'package:app/components/custom_app_bar.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:app/domain/services/chat_display_service.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:get/get.dart';

class GameSelectionPage extends StatefulWidget {
  @override
  State<GameSelectionPage> createState() => _GameSelectionPageState();
}

class _GameSelectionPageState extends State<GameSelectionPage> {
  final CarouselService service = Get.find();

  final GameManagerService gameManagerService = Get.find();

  final ChatManagerService chatManagerService = Get.find();
  final ChatDisplayService chatDisplayService = Get.find();

  bool showChat = false;
  int unreadMessages = 0;

  late StreamSubscription<bool> chatDisplaySubscription;

  late StreamSubscription<int> unreadMessagesSubscription;

  @override
  void initState() {
    super.initState();
    chatDisplaySubscription =
        chatDisplayService.isChatVisible.stream.listen((value) {
      setState(() {
        showChat = value;
      });
    });
    unreadMessagesSubscription =
        chatManagerService.unreadMessages.stream.listen((value) {
      setState(() {
        unreadMessages = value;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(children: [
      Scaffold(
        appBar: CustomAppBar.buildLogoutOnly(context,
            AppLocalizations.of(context)!.selectPageTitle, unreadMessages),
        body: Column(
          children: [
            SizedBox(height: 30),
            Expanded(
              child: Carousel(isCarouselForAdminPage: false),
            ),
          ],
        ),
      ),
      showChat
          ? Positioned(
              height: MediaQuery.of(context).size.height - 100,
              width: MediaQuery.of(context).size.width - 100,
              top: 50,
              left: 50,
              child: ChatPanel())
          : SizedBox.shrink()
    ]);
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    chatDisplaySubscription.cancel();
    unreadMessagesSubscription.cancel();
  }
}
