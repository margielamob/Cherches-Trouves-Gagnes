import 'package:app/components/classic_game_modal.dart';
import 'package:flutter/material.dart';

class MainPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return ClassicGameModal();
                          },
                        );
                      },
                      child: Text('Mode de jeux classique'),
                    ),
                    SizedBox(height: 50),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/adminPage');
                      },
                      child: Text('Go to admin'),
                    ),
                    SizedBox(height: 100),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/pageC');
                      },
                      child: Text('Go to Page C'),
                    ),
                    SizedBox(height: 50),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/ProfilePage');
                      },
                      child: Text('Page de profile'),
                    ),
                    SizedBox(height: 30),
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
