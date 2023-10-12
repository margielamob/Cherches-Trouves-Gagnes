import 'package:app/services/auth-service.dart';
import 'package:app/services/user-service.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';

class SettingPage extends StatefulWidget {
  SettingPage({
    Key? key,
  }) : super(key: key);
  @override
  State<SettingPage> createState() => SettingPageState();
}

class SettingPageState extends State<SettingPage> {
  final AuthService authService = GetIt.I.get<AuthService>();
  final UserService userService = GetIt.I.get<UserService>();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Setting'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            SizedBox(height: 20),
            Row(mainAxisAlignment: MainAxisAlignment.center, children: <Widget>[
              Container(
                  width: 300,
                  height: 400,
                  color: Colors.blue,
                  child: Center(
                    child: TextButton(
                        onPressed: () async {
                          // await userService.updateUserTheme('dark');
                        },
                        style: ButtonStyle(),
                        child: const Text(
                          "Modifier l'avatar",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                          ),
                        )),
                  )),
              SizedBox(width: 20),
              Container(
                  width: 300,
                  height: 400,
                  color: Colors.blue,
                  child: Center(
                    child: TextButton(
                        onPressed: () async {
                          await authService.signOut();
                        },
                        style: ButtonStyle(),
                        child: const Text(
                          "Se déconnecter",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                          ),
                        )),
                  ))
            ])
          ],
        ),
      ),
    );
  }
}
