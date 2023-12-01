import 'dart:async';

import 'package:app/components/carousel.dart';
import 'package:app/components/carousel_modal.dart';
import 'package:app/components/chat/chat_panel.dart';
import 'package:app/components/custom_app_bar.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:app/domain/services/chat_display_service.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:app/pages/create_game_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class AdminPage extends StatefulWidget {
  @override
  State<AdminPage> createState() => _AdminPageState();
}

class _AdminPageState extends State<AdminPage> {
  final CarouselService service = Get.find();

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
    chatDisplayService.isChatVisible.stream.listen((value) {
      if (mounted) {
        setState(() {
          showChat = value;
        });
      }
    });
    chatManagerService.unreadMessages.stream.listen((value) {
      if (mounted) {
        setState(() {
          unreadMessages = value;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final carouselService = Provider.of<CarouselService>(context);

    return Stack(
      children: [
        Scaffold(
          appBar: CustomAppBar.buildLogoutOnly(
              context, 'Administration', unreadMessages),
          body: Column(
            children: [
              Padding(
                padding: EdgeInsets.all(20.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    FilledButton(
                      onPressed: () {
                        Get.to(CreateGamePage());
                      },
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          Text(AppLocalizations.of(context)!.adminPageCreation),
                          SizedBox(width: 2.0),
                          Icon(Icons.create),
                        ],
                      ),
                    ),
                    SizedBox(width: 10.0),
                    FilledButton(
                      onPressed: carouselService.areGamesAvailable()
                          ? () {
                              showDialog(
                                context: context,
                                builder: (BuildContext context) {
                                  return CarouselModal(
                                    verification: AppLocalizations.of(context)!
                                        .adminPageSuppGames,
                                    isAllGames: true,
                                  );
                                },
                              );
                            }
                          : null,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          Text(AppLocalizations.of(context)!
                              .adminPageSuppAllGame),
                          SizedBox(width: 2.0),
                          Icon(Icons.delete),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Carousel(isCarouselForAdminPage: true),
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
      ],
    );
  }
}
