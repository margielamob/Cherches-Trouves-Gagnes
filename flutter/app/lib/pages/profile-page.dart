import 'package:app/components/avatar-dialog.dart';
import 'package:app/components/avatar/avatar.dart';
import 'package:app/services/auth-service.dart';
import 'package:app/services/user-controller-service.dart';
import 'package:app/services/user-service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ProfilePage extends StatefulWidget {
  ProfilePage({
    Key? key,
  }) : super(key: key);
  @override
  State<ProfilePage> createState() => ProfilePageState();
}

class ProfilePageState extends State<ProfilePage> {
  final UserService userService = Get.find();
  final AuthService authService = Get.find();
  final UserControllerService userControllerService = Get.find();
  UserData? currentUser;
  String? avatar;

  void setAvatar() async {
    // String img = await userService.getPhotoURL(currentUser!.uid);
    // setState(() {
    //   avatar = img;
    // });
  }

  @override
  void initState() {
    super.initState();
    userControllerService.onUserDataReady = (userData) {
      setState(() {
        currentUser = userData;
      });
    };
    userControllerService.onUserAvatarReady = (userAvatar) {
      setState(() {
        avatar = userAvatar;
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
                      showDialog(
                        context: context,
                        builder: (BuildContext context) {
                          return AvatarDialog();
                        },
                      );
                    },
                  ),
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
                          SizedBox(height: 10.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              TextButton(
                                  onPressed: () async {
                                    // function to change UserName
                                  },
                                  child: Text("Nom d'utilisateur "),
                                  style: ButtonStyle(
                                          alignment: Alignment.center,
                                          minimumSize:
                                              MaterialStateProperty.all<Size>(
                                                  Size(300, 50)))
                                      .copyWith(
                                          backgroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Theme.of(context)
                                                      .primaryColor),
                                          foregroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Colors.white))),
                              SizedBox(width: 10.0),
                              TextButton(
                                  onPressed: () async {
                                    // function to change UserName
                                  },
                                  child: Text("${currentUser?.displayName}"),
                                  style: ButtonStyle(
                                          alignment: Alignment.center,
                                          minimumSize:
                                              MaterialStateProperty.all<Size>(
                                                  Size(200, 50)))
                                      .copyWith(
                                          backgroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Theme.of(context)
                                                      .primaryColorLight),
                                          foregroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Colors.black))),
                            ],
                          ),
                          SizedBox(height: 5.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              TextButton(
                                  onPressed: () async {
                                    // function to change Theme
                                  },
                                  child: Text("Thème visuel "),
                                  style: ButtonStyle(
                                          alignment: Alignment.center,
                                          minimumSize:
                                              MaterialStateProperty.all<Size>(
                                                  Size(300, 50)))
                                      .copyWith(
                                          backgroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Theme.of(context)
                                                      .primaryColor),
                                          foregroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Colors.white))),
                              SizedBox(width: 10.0),
                              TextButton(
                                  onPressed: () async {
                                    // function to change Theme
                                  },
                                  child: Text("${currentUser?.theme}"),
                                  style: ButtonStyle(
                                          alignment: Alignment.center,
                                          minimumSize:
                                              MaterialStateProperty.all<Size>(
                                                  Size(200, 50)))
                                      .copyWith(
                                          backgroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Theme.of(context)
                                                      .primaryColorLight),
                                          foregroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Colors.black))),
                            ],
                          ),
                          SizedBox(height: 5.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              TextButton(
                                  onPressed: () async {
                                    // function to change Theme
                                  },
                                  child: Text("Langue"),
                                  style: ButtonStyle(
                                          alignment: Alignment.center,
                                          minimumSize:
                                              MaterialStateProperty.all<Size>(
                                                  Size(300, 50)))
                                      .copyWith(
                                          backgroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Theme.of(context)
                                                      .primaryColor),
                                          foregroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Colors.white))),
                              SizedBox(width: 10.0),
                              TextButton(
                                  onPressed: () async {
                                    // function to change Theme
                                  },
                                  child: Text("${currentUser?.language}"),
                                  style: ButtonStyle(
                                          alignment: Alignment.center,
                                          minimumSize:
                                              MaterialStateProperty.all<Size>(
                                                  Size(200, 50)))
                                      .copyWith(
                                          backgroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Theme.of(context)
                                                      .primaryColorLight),
                                          foregroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Colors.black))),
                            ],
                          ),
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
                          SizedBox(height: 10.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              TextButton(
                                  onPressed: () async {
                                    // function to change Theme
                                  },
                                  child: Text("Nombre de parties jouées"),
                                  style: ButtonStyle(
                                          alignment: Alignment.center,
                                          minimumSize:
                                              MaterialStateProperty.all<Size>(
                                                  Size(300, 50)))
                                      .copyWith(
                                          backgroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Theme.of(context)
                                                      .primaryColor),
                                          foregroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Colors.white))),
                              SizedBox(width: 10.0),
                              TextButton(
                                  onPressed: () async {
                                    // function to change Theme
                                  },
                                  child: Text("${0}"),
                                  style: ButtonStyle(
                                          alignment: Alignment.center,
                                          minimumSize:
                                              MaterialStateProperty.all<Size>(
                                                  Size(200, 50)))
                                      .copyWith(
                                          backgroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Theme.of(context)
                                                      .primaryColorLight),
                                          foregroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Colors.black))),
                            ],
                          ),
                          SizedBox(height: 5.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              TextButton(
                                  onPressed: () async {
                                    // function to change Theme
                                  },
                                  child: Text("Nombre de parties gagnées"),
                                  style: ButtonStyle(
                                          alignment: Alignment.center,
                                          minimumSize:
                                              MaterialStateProperty.all<Size>(
                                                  Size(300, 50)))
                                      .copyWith(
                                          backgroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Theme.of(context)
                                                      .primaryColor),
                                          foregroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Colors.white))),
                              SizedBox(width: 10.0),
                              TextButton(
                                  onPressed: () async {
                                    // function to change Theme
                                  },
                                  child: Text("${0}"),
                                  style: ButtonStyle(
                                          alignment: Alignment.center,
                                          minimumSize:
                                              MaterialStateProperty.all<Size>(
                                                  Size(200, 50)))
                                      .copyWith(
                                          backgroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Theme.of(context)
                                                      .primaryColorLight),
                                          foregroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Colors.black))),
                            ],
                          ),
                          SizedBox(height: 5.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              TextButton(
                                  onPressed: () async {
                                    // function to change Theme
                                  },
                                  child: Text(
                                      "Moyenne de différence trouvé par partie"),
                                  style: ButtonStyle(
                                          alignment: Alignment.center,
                                          minimumSize:
                                              MaterialStateProperty.all<Size>(
                                                  Size(300, 50)))
                                      .copyWith(
                                          backgroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Theme.of(context)
                                                      .primaryColor),
                                          foregroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Colors.white))),
                              SizedBox(width: 10.0),
                              TextButton(
                                  onPressed: () async {
                                    // function to change Theme
                                  },
                                  child: Text("${0}"),
                                  style: ButtonStyle(
                                          alignment: Alignment.center,
                                          minimumSize:
                                              MaterialStateProperty.all<Size>(
                                                  Size(200, 50)))
                                      .copyWith(
                                          backgroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Theme.of(context)
                                                      .primaryColorLight),
                                          foregroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Colors.black))),
                            ],
                          ),
                          SizedBox(height: 5.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              TextButton(
                                  onPressed: () async {
                                    // function to change Theme
                                  },
                                  child: Text("Temps moyen par parties"),
                                  style: ButtonStyle(
                                          alignment: Alignment.center,
                                          minimumSize:
                                              MaterialStateProperty.all<Size>(
                                                  Size(300, 50)))
                                      .copyWith(
                                          backgroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Theme.of(context)
                                                      .primaryColor),
                                          foregroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Colors.white))),
                              SizedBox(width: 10.0),
                              TextButton(
                                  onPressed: () async {
                                    // function to change Theme
                                  },
                                  child: Text("${0} secondes"),
                                  style: ButtonStyle(
                                          alignment: Alignment.center,
                                          minimumSize:
                                              MaterialStateProperty.all<Size>(
                                                  Size(200, 50)))
                                      .copyWith(
                                          backgroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Theme.of(context)
                                                      .primaryColorLight),
                                          foregroundColor:
                                              MaterialStateProperty.all<Color>(
                                                  Colors.black))),
                            ],
                          ),
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
