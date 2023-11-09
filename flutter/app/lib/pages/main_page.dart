import 'package:app/components/classic_game_dialog.dart';
import 'package:app/components/logout_dialog.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class MainPage extends StatelessWidget {
  final GameManagerService gameManagerService = Get.find();

  @override
  Widget build(BuildContext context) {
    gameManagerService.setCurrentUser();
    return Scaffold(
      appBar: AppBar(
        title: Text("Menu principal"),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.exit_to_app),
            onPressed: () => showDialog(
                context: context,
                builder: (BuildContext context) {
                  return LogoutDialog();
                }),
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  children: [
                    Padding(
                      padding: EdgeInsets.fromLTRB(0, 25, 60, 0),
                      child: Row(
                        children: [
                          Text(
                            'Jeux de différences',
                            style: TextStyle(
                                fontSize: 35, fontWeight: FontWeight.bold),
                          ),
                          SizedBox(width: 20),
                          Image.asset(
                            'assets/logoJdD.png',
                            width: 100,
                            height: 100,
                          ),
                        ],
                      ),
                    ),
                    SizedBox(height: 70),
                    ElevatedButton(
                      style: ButtonStyle(
                        minimumSize:
                            MaterialStateProperty.all(Size(160.0, 60.0)),
                      ),
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return ClassicGameDialog();
                          },
                        );
                      },
                      child: Text('Mode de jeux classique'),
                    ),
                    SizedBox(height: 30),
                    ElevatedButton(
                      style: ButtonStyle(
                        minimumSize:
                            MaterialStateProperty.all(Size(160.0, 60.0)),
                      ),
                      onPressed: () {
                        Navigator.pushNamed(context, '/adminPage');
                      },
                      child: Text('Go to admin'),
                    ),
                    SizedBox(height: 60),
                    ElevatedButton(
                      style: ButtonStyle(
                        minimumSize:
                            MaterialStateProperty.all(Size(160.0, 60.0)),
                      ),
                      onPressed: () {},
                      child: Text('Go to Page F'),
                    ),
                    SizedBox(height: 30),
                    ElevatedButton(
                      style: ButtonStyle(
                        minimumSize:
                            MaterialStateProperty.all(Size(160.0, 60.0)),
                      ),
                      onPressed: () {
                        Navigator.pushNamed(context, '/ProfilePage');
                      },
                      child: Text('Page de profile'),
                    ),
                    SizedBox(height: 20),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          'Équipe 103:',
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        Padding(
                          padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                          child: Text(
                            'Thierry, Ahmed El, Ahmed Ben, Skander, Samy',
                            style: TextStyle(
                                fontSize: 15, fontWeight: FontWeight.w400),
                          ),
                        )
                      ],
                    )
                  ],
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Image.asset(
                      'assets/quote.png',
                      height: 600,
                    ),
                  ],
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
