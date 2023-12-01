import 'package:app/components/custom_app_bar.dart';
import 'package:app/components/user_personal_info.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class ProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar.buildLogoutOnly(
          context, AppLocalizations.of(context)!.profilePageTitle),
      body: UserPersonalInfo(),
    );
  }
}
