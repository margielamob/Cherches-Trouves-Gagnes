import 'dart:typed_data';

import 'package:app/components/avatar/avatar.dart';
import 'package:app/main.dart';
import 'package:app/services/auth-service.dart';
import 'package:app/services/image-upload-serice.dart';
import 'package:app/services/user-controller-service.dart';
import 'package:app/services/user-service.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:image_picker/image_picker.dart';

class ProfilePage extends StatefulWidget {
  ProfilePage({
    Key? key,
  }) : super(key: key);
  @override
  State<ProfilePage> createState() => ProfilePageState();
}

class ProfilePageState extends State<ProfilePage> {
  final AuthService authService = GetIt.I.get<AuthService>();
  UserData? currentUser = locator.get<UserControllerService>().currentUser;
  Uint8List? avatar;

  void selectAvatar() async {
    Uint8List img = await pickImage(ImageSource.gallery);
    setState(() {
      avatar = img;
    });
  }

  @override
  void initState() {
    super.initState();
    final userControllerService = locator.get<UserControllerService>();
    userControllerService.onUserDataReady = (userData) {
      setState(() {
        currentUser = userData;
      });
    };
  }

  Widget build(BuildContext context) {
    print(currentUser?.displayName);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColorLight,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(40.0),
                  bottomRight: Radius.circular(40.0),
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  Avatar(
                    photoURL: avatar,
                    onTap: () async {
                      selectAvatar();
                    },
                  ),
                  Text("Salut ${currentUser?.displayName}"),
                ],
              ),
            ),
          ),
          Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: <Widget>[
                    SizedBox(height: 20.0),
                    Expanded(
                      child: Column(
                        children: <Widget>[
                          Text("Profile",
                              style: TextStyle(
                                fontSize: 20.0,
                                fontWeight: FontWeight.bold,
                              )),
                          TextFormField(
                            decoration: InputDecoration(
                                hintText:
                                    "Nom d'utilisateur : ${currentUser?.displayName}"),
                          ),
                          TextFormField(
                            decoration: InputDecoration(
                                hintText:
                                    "Thème visuel : ${currentUser?.theme}"),
                          ),
                          TextFormField(
                            decoration: InputDecoration(
                                hintText: "Langue : ${currentUser?.language}"),
                          )
                        ],
                      ),
                    ),
                    Expanded(
                      child: Column(
                        children: <Widget>[
                          Text("Statistique du compte",
                              style: TextStyle(
                                fontSize: 20.0,
                                fontWeight: FontWeight.bold,
                              )),
                          TextFormField(
                            decoration: InputDecoration(
                                hintText: "Nombre de parties jouées : ${0}"),
                          ),
                          TextFormField(
                            decoration: InputDecoration(
                                hintText: "Nombre de parties gagnées : ${0}"),
                          ),
                          TextFormField(
                            decoration: InputDecoration(
                                hintText:
                                    "Moyenne de différence trouvé par partie : ${0}"),
                          ),
                          TextFormField(
                            decoration: InputDecoration(
                                hintText:
                                    "Temps moyen par parties : ${0} secondes"),
                          )
                        ],
                      ),
                    ),
                    TextButton(
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        child: Text("Sauvegarder le profile"),
                        style: ButtonStyle(alignment: Alignment.center)
                            .copyWith(
                                backgroundColor:
                                    MaterialStateProperty.all<Color>(
                                        Theme.of(context).primaryColor),
                                foregroundColor:
                                    MaterialStateProperty.all<Color>(
                                        Colors.white)))
                  ],
                ),
              ))
        ],
      ),
    );
  }
}
