import 'package:app/components/avatar.dart';
import 'package:app/components/avatar_dialog.dart';
import 'package:app/components/update_name_dialog.dart';
import 'package:app/domain/models/user_data.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:app/domain/services/profile_page_manager.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class UserDetailButton extends StatelessWidget {
  final String content;
  final VoidCallback onPressed;

  UserDetailButton({required this.content, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: onPressed,
      style: ButtonStyle(
        minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Text(content),
        ],
      ),
    );
  }
}

class UserDetailContent extends StatelessWidget {
  final String content;

  UserDetailContent({required this.content});

  @override
  Widget build(BuildContext context) {
    return Text(
      content,
      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
    );
  }
}

class HeavyClientTextBox extends StatelessWidget {
  final String content;

  HeavyClientTextBox({required this.content});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 130.0,
        height: 35.0,
        decoration: BoxDecoration(
          color: Colors.deepPurple,
          borderRadius: BorderRadius.all(
            Radius.circular(3.0), // Set the border radius
          ),
        ),
        child: Center(
          child: Text(
            content,
            style: TextStyle(
              color: Colors.white,
              fontSize: 14.0,
            ),
          ),
        ),
      ),
    );
  }
}

class CardWrapper extends StatelessWidget {
  final Widget child;
  CardWrapper({required this.child});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 400,
      height: 350,
      child: Card(
        elevation: 2,
        shadowColor: Color.fromARGB(255, 46, 46, 46),
        child:
            Padding(padding: EdgeInsets.fromLTRB(60, 8, 60, 8), child: child),
      ),
    );
  }
}

class AccountSetting extends StatelessWidget {
  final PersonalUserService userService = Get.find();

  final UserData currentUserData;
  AccountSetting({required this.currentUserData});

  void updateTheme(String newTheme) async {
    DocumentReference userDoc =
        userService.db.collection('users').doc(currentUserData.uid);

    await userDoc.update({'theme': newTheme}).catchError((e) => print(e));
  }

  void updateLang(String newLang) async {
    userService.language = newLang == 'English' ? 'En' : 'Fr';
    DocumentReference userDoc =
        userService.db.collection('users').doc(currentUserData.uid);

    await userDoc
        .update({'language': userService.language}).catchError((e) => print(e));
  }

  @override
  Widget build(BuildContext context) {
    final profileManager = Provider.of<ProfilePageManager>(context);
    return CardWrapper(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SizedBox(height: 10),
          Text("Account settings",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
          SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              UserDetailButton(
                content: "Update Avatar",
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AvatarDialog();
                    },
                  );
                },
              ),
              SizedBox(width: 30),
              GestureDetector(
                child: Avatar(),
                onTap: () {
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
          SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              UserDetailButton(
                content: "Update Username",
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return UsernameDialog(userId: currentUserData.uid);
                    },
                  );
                },
              ),
              SizedBox(width: 30),
              UserDetailContent(content: currentUserData.displayName),
            ],
          ),
          SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              HeavyClientTextBox(content: "Theme"),
              SizedBox(width: 30),
              DropdownButton<String>(
                value: currentUserData.theme,
                onChanged: (newValue) {
                  print(newValue);
                  updateTheme(newValue!);
                  profileManager.setTheme(newValue);
                },
                items: ['Alternative', 'Default']
                    .map<DropdownMenuItem<String>>((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
              ),
            ],
          ),
          SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              HeavyClientTextBox(content: "Language"),
              SizedBox(width: 30),
              DropdownButton<String>(
                value:
                    currentUserData.language == 'En' ? 'English' : 'Français',
                onChanged: (newValue) {
                  updateLang(newValue!);
                },
                items: ['English', 'Français']
                    .map<DropdownMenuItem<String>>((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class AccountStatistics extends StatelessWidget {
  final UserData currentUserData;
  AccountStatistics({required this.currentUserData});

  @override
  Widget build(BuildContext context) {
    return CardWrapper(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SizedBox(height: 10),
          Text("Account Statistics",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
          SizedBox(height: 30),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              HeavyClientTextBox(content: "Played Games"),
              UserDetailContent(content: currentUserData.gamePlayed.toString())
            ],
          ),
          SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              HeavyClientTextBox(content: "Won Games"),
              UserDetailContent(content: currentUserData.gameWins.toString())
            ],
          ),
          SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              HeavyClientTextBox(content: "Average Difference"),
              UserDetailContent(
                  content: (currentUserData.numberDifferenceFound /
                          currentUserData.gamePlayed)
                      .toString())
            ],
          ),
          SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              HeavyClientTextBox(content: "Average Time per Game (seconds)"),
              SizedBox(width: 20),
              UserDetailContent(
                  content: (currentUserData.totalTimePlayed /
                          currentUserData.gamePlayed)
                      .toString())
            ],
          ),
        ],
      ),
    );
  }
}

class UserPersonalInfo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final AuthService authService = AuthService();

    return FutureBuilder<String>(
      future: authService.getCurrentUserId(),
      builder: (BuildContext context, AsyncSnapshot<String> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Center(
              child: Text(
                  "Erreur lors de la récupération de l'ID de l'utilisateur."));
        }

        if (!snapshot.hasData) {
          return Center(child: Text("ID de l'utilisateur non disponible."));
        }

        final userId = snapshot.data!;

        return StreamBuilder<DocumentSnapshot>(
          stream: FirebaseFirestore.instance
              .collection('users')
              .doc(userId)
              .snapshots(),
          builder:
              (BuildContext context, AsyncSnapshot<DocumentSnapshot> snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Center(child: CircularProgressIndicator());
            }

            if (snapshot.hasError) {
              return Center(
                  child: Text(
                      "Erreur lors de la récupération des données de l'utilisateur."));
            }

            if (!snapshot.hasData || !snapshot.data!.exists) {
              return Center(
                  child: Text("Données de l'utilisateur non trouvées."));
            }

            final currentUserData = UserData.fromSnapshot(snapshot.data!);

            return Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AccountSetting(currentUserData: currentUserData),
                SizedBox(height: 20),
                AccountStatistics(currentUserData: currentUserData),
              ],
            );
          },
        );
      },
    );
  }
}
