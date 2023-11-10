import 'package:app/components/avatar.dart';
import 'package:app/components/avatar_dialog.dart';
import 'package:app/domain/services/profile_page_manager.dart';
import 'package:flutter/material.dart';
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
  @override
  Widget build(BuildContext context) {
    final ProfilePageManager profileManager =
        Provider.of<ProfilePageManager>(context);

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
                content: "Avatar",
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
                content: "Pseudonyme",
                onPressed: () {
                  print("Pseudonyme button was pressed");
                },
              ),
              SizedBox(width: 30),
              UserDetailContent(
                  content: profileManager.currentUser!.displayName),
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
                value: profileManager.currentUser!.theme,
                onChanged: (newValue) {
                  // TODO: change the theme
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
                value: profileManager.currentUser!.language == 'En'
                    ? 'English'
                    : 'Français',
                onChanged: (newValue) {
                  // TODO: update language based on choice
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
              UserDetailContent(content: "0")
            ],
          ),
          SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              HeavyClientTextBox(content: "Won Games"),
              UserDetailContent(content: "0")
            ],
          ),
          SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              HeavyClientTextBox(content: "Average Difference"),
              UserDetailContent(content: "0")
            ],
          ),
          SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              HeavyClientTextBox(content: "Average Time"),
              SizedBox(width: 20),
              UserDetailContent(content: "0")
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
    final ProfilePageManager profilePageManager =
        Provider.of<ProfilePageManager>(context);

    if (profilePageManager.currentUser == null) {
      profilePageManager.initUser();
      return Center(child: CircularProgressIndicator());
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [AccountSetting(), SizedBox(height: 20), AccountStatistics()],
    );
  }
}
