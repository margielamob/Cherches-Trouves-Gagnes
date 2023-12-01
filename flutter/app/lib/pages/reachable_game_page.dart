import 'dart:async';

import 'package:app/components/chat/chat_panel.dart';
import 'package:app/components/custom_app_bar.dart';
import 'package:app/components/reachable_games_carrousel.dart';
import 'package:app/domain/services/chat_display_service.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/utils/game_mode.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:get/get.dart';

class ReachableGamePage extends StatefulWidget {
  @override
  State<ReachableGamePage> createState() => _ReachableGamePageState();
}

class _ReachableGamePageState extends State<ReachableGamePage> {
  final GameManagerService gameManagerService = Get.find();

  final ChatManagerService chatManagerService = Get.find();
  final ChatDisplayService chatDisplayService = Get.find();

  bool showChat = false;
  int unreadMessages = 0;

  StreamSubscription<bool>? chatDisplaySubscription;
  StreamSubscription<int>? unreadMessagesSubscription;

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    chatDisplaySubscription?.cancel();
    unreadMessagesSubscription?.cancel();
  }

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

  final bool enabled = false;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Scaffold(
          appBar: CustomAppBar.buildLogoutOnly(context,
              AppLocalizations.of(context)!.reachableGames, unreadMessages),
          body: Padding(
            padding: EdgeInsets.all(20.0),
            child: ReachableGamesCarrousel(
                isClassicGame: gameManagerService.gameMode?.value ==
                        AvailableGameMode.classic
                    ? true
                    : false),
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
      ],
    );
  }
}
