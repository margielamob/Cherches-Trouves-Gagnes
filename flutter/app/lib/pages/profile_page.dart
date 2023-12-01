import 'dart:async';

import 'package:app/components/chat/chat_panel.dart';
import 'package:app/components/custom_app_bar.dart';
import 'package:app/components/user_personal_info.dart';
import 'package:app/domain/services/chat_display_service.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:get/get.dart';

class ProfilePage extends StatefulWidget {
  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
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

  @override
  Widget build(BuildContext context) {
    return Stack(children: [
      Scaffold(
        appBar: CustomAppBar.buildLogoutOnly(context,
            AppLocalizations.of(context)!.profilePageTitle, unreadMessages),
        body: UserPersonalInfo(),
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
}
