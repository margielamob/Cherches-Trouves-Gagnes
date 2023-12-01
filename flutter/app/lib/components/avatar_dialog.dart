import 'package:app/components/avatar.dart';
import 'package:app/domain/models/user_data.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:app/pages/profile_page.dart';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class AvatarDialog extends StatefulWidget {
  final String? imagePath;
  final XFile? imageFile;
  AvatarDialog({Key? key, this.imagePath, this.imageFile}) : super(key: key);
  @override
  State<AvatarDialog> createState() => AvatarDialogState();
}

class AvatarDialogState extends State<AvatarDialog> {
  final PersonalUserService userService = Get.find();
  final AuthService authService = Get.find();
  UserData? currentUser;
  String? avatar;
  String? selectedAvatar;
  bool isLoading = false;

  Future<void> initUser() async {
    currentUser = await authService.getCurrentUser();
    if (currentUser != null) {
      if (currentUser!.photoURL!.startsWith('assets/')) {
        avatar = currentUser!.photoURL;
        selectedAvatar = currentUser!.photoURL;
        return;
      } else {
        avatar = await userService.getPhotoURL(currentUser!.uid);
      }
    } else {
      avatar = 'assets/default-user-icon.jpg';
      selectedAvatar = 'assets/default-user-icon.jpg';
    }
  }

  @override
  void initState() {
    super.initState();
    initUser();
  }
  @override
  Widget build(BuildContext context) {
    return Dialog(
        child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                const Text(
                  'Choissisez votre avatar',
                  style: TextStyle(
                    fontSize: 20.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 15),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    MouseRegion(
                      cursor: SystemMouseCursors.click,
                      child: Container(
                        decoration: BoxDecoration(
                          border: Border.all(
                              color: selectedAvatar ==
                                      'assets/default-user-icon.jpg'
                                  ? Colors.deepPurple
                                  : Colors.transparent,
                              width: 3.0),
                          borderRadius: BorderRadius.circular(50.0),
                        ),
                        child: Avatar(
                          photoURL: 'assets/default-user-icon.jpg',
                          onTap: () async {
                            selectedAvatar = 'assets/default-user-icon.jpg';
                            setState(() {});
                          },
                        ),
                      ),
                    ),
                    SizedBox(width: 10.0),
                    MouseRegion(
                      cursor: SystemMouseCursors.click,
                      child: Container(
                        decoration: BoxDecoration(
                          border: Border.all(
                              color: selectedAvatar ==
                                      'assets/avatar-predefini/avatar2.png'
                                  ? Colors.deepPurple
                                  : Colors.transparent,
                              width: 3.0),
                          borderRadius: BorderRadius.circular(50.0),
                        ),
                        child: Avatar(
                          photoURL: 'assets/avatar-predefini/avatar2.png',
                          onTap: () async {
                            selectedAvatar =
                                'assets/avatar-predefini/avatar2.png';
                            setState(() {});
                          },
                        ),
                      ),
                    ),
                    SizedBox(width: 10.0),
                    MouseRegion(
                      cursor: SystemMouseCursors.click,
                      child: Container(
                        decoration: BoxDecoration(
                          border: Border.all(
                              color: selectedAvatar ==
                                      'assets/avatar-predefini/avatar3.png'
                                  ? Colors.deepPurple
                                  : Colors.transparent,
                              width: 3.0),
                          borderRadius: BorderRadius.circular(50.0),
                        ),
                        child: Avatar(
                          photoURL: 'assets/avatar-predefini/avatar3.png',
                          onTap: () async {
                            selectedAvatar =
                                'assets/avatar-predefini/avatar3.png';
                            setState(() {});
                          },
                        ),
                      ),
                    ),
                    widget.imagePath == null
                        ? SizedBox(width: 10.0)
                        : MouseRegion(
                            cursor: SystemMouseCursors.click,
                            child: Container(
                              decoration: BoxDecoration(
                                border: Border.all(
                                    color: selectedAvatar == widget.imagePath
                                        ? Colors.deepPurple
                                        : Colors.transparent,
                                    width: 3.0),
                                borderRadius: BorderRadius.circular(50.0),
                              ),
                              child: Avatar(
                                photoURL: widget.imagePath,
                                onTap: () async {
                                  selectedAvatar = widget.imagePath;
                                  setState(() {});
                                },
                              ),
                            ),
                          ),
                    SizedBox(width: 10.0),
                    MouseRegion(
                      cursor: SystemMouseCursors.click,
                      child: Avatar(
                        photoURL: 'assets/camera.png',
                        onTap: () async {
                          Navigator.pushNamed(context, '/TakePictureScreen');
                        },
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20.0),
                isLoading
                    ? CircularProgressIndicator()
                    : FilledButton(
                        onPressed: () async {
                          setState(() {
                            isLoading = true;
                          });
                          if (selectedAvatar != null) {
                            if (selectedAvatar == widget.imagePath) {
                              await userService.uploadAvatar(
                                  currentUser!.uid, widget.imageFile!);
                              await userService.updateUserAvatar(
                                  currentUser!.uid,
                                  'avatars/${currentUser?.uid}/avatar.jpg');
                            } else {
                              await userService.updateUserAvatar(
                                  currentUser!.uid, selectedAvatar!);
                            }
                          }
                          // ignore: use_build_context_synchronously
                          Navigator.of(context).pop();
                          Get.off(ProfilePage());
                        },
                        child: Text("Sauvegarder votre choix")),
              ],
            )));
  }
}
