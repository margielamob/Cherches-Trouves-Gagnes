import 'package:flutter/material.dart';

class _PlayersCard extends StatelessWidget {
  final String firstName;
  final String lastName;
  int nbDifferences = 0;

  _PlayersCard({required this.firstName, required this.lastName});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 250,
      height: 80,
      child: Card(
        elevation: 2,
        shadowColor: Color.fromARGB(255, 46, 46, 46),
        child: Padding(
          padding: EdgeInsets.all(10.0),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  FlutterLogo(size: 30.0),
                  SizedBox(width: 10),
                  Text('$firstName $lastName', style: TextStyle(fontSize: 16))
                ],
              ),
              SizedBox(height: 5),
              Text('Nombre de différences'),
              Text('trouvés : 4'),
            ],
          ),
        ),
      ),
    );
  }
}

class CurrentPlayers extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 100,
      width: 1000,
      child: Center(
        child: ListView(
          scrollDirection: Axis.horizontal,
          shrinkWrap: true,
          children: <Widget>[
            _PlayersCard(firstName: "Thierry", lastName: "Beaulieu"),
            _PlayersCard(firstName: "Sulayman", lastName: "Hosna"),
            _PlayersCard(firstName: "Ahmed", lastName: "Ben-Othman"),
            _PlayersCard(firstName: "Samy", lastName: "Labassi"),
          ],
        ),
      ),
    );
  }
}
