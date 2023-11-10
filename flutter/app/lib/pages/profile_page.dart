import 'package:app/components/custom_app_bar.dart';
import 'package:app/components/user_personal_info.dart';
import 'package:flutter/material.dart';

class ProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar.buildLogoutOnly(context, 'Page de profile'),
      body: UserPersonalInfo(),
    );
  }
}
