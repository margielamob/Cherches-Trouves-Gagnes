import 'package:app/services/auth-service.dart';
import 'package:app/services/user-service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class AvatarDialog extends StatefulWidget {
  AvatarDialog({
    Key? key,
  }) : super(key: key);
  @override
  State<AvatarDialog> createState() => AvatarDialogState();
}

class AvatarDialogState extends State<AvatarDialog> {
  final UserService userService = Get.find();
  final AuthService authService = Get.find();
  String? avatar;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Choissiez votre avatar"),
    );
  }
}
