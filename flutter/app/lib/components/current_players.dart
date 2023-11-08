import 'package:flutter/material.dart';

class _PlayersCard extends StatelessWidget {
  final String fname;
  final String lname;
  const _PlayersCard({required this.fname, required this.lname});

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
                  Text('$fname $lname', style: TextStyle(fontSize: 16))
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
  const CurrentPlayers({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 100,
      width: 1000,
      child: Center(
        child: ListView(
          scrollDirection: Axis.horizontal,
          shrinkWrap: true,
          children: const <Widget>[
            _PlayersCard(fname: "Thierry", lname: "Beaulieu"),
            _PlayersCard(fname: "Sulayman", lname: "Hosna"),
            _PlayersCard(fname: "Ahmed", lname: "Ben-Othman"),
            _PlayersCard(fname: "Samy", lname: "Labassi"),
          ],
        ),
      ),
    );
  }
}
