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
  String? avatarUrl;

  @override
  void initState() {
    super.initState();
    // Récupérer l'URL de l'avatar de l'utilisateur au chargement de la page
    // avatarUrl = userService.getUserAvatarUrl();
  }

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
                      child: FutureBuilder<UserData?>(
                        future: authService.getCurrentUser(),
                        builder: (BuildContext context, AsyncSnapshot<UserData?> snapshot) {
                          if (snapshot.connectionState == ConnectionState.waiting) {
                            return CircularProgressIndicator();
                          } else if (snapshot.hasError) {
                            return Text('Error: ${snapshot.error}');
                          } else {
                            UserData? userData = snapshot.data;

                            return Row(children: [
                              if (avatarUrl != null)
                                Image.network(
                                  avatarUrl!,
                                  width: 100,
                                  height: 100,
                                  fit: BoxFit.cover,
                                ),
                              TextButton(
                                  onPressed: () async {
                                    // await userService.updateUserTheme('dark');
                                  },
                                  style: ButtonStyle(),
                                  child: Text(
                                    userData?.displayName ?? 'displayName',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 20,
                                    ),
                                  )),
                            ]);
                          }
                        }
                      ))),
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
