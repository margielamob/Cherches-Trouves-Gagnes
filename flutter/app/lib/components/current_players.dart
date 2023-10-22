import 'package:flutter/material.dart';

class _PlayersCard extends StatelessWidget {
  final String fname;
  final String lname;
  const _PlayersCard({required this.fname, required this.lname});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shadowColor: Color.fromARGB(255, 46, 46, 46),
      child: ListTile(
        leading: FlutterLogo(size: 56.0),
        title: Text('$fname $lname'),
        subtitle: Text('Nombre de différences trouvés : 4'),
      ),
    );
  }
}

class CurrentPlayers extends StatelessWidget {
  const CurrentPlayers({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 800,
          color: Colors.deepPurple, // Set the background color for the bar
          padding: EdgeInsets.all(16.0),
          child: Text(
            "Current players",
            style: TextStyle(
              color: Colors.white, // Set the text color
              fontSize: 20, // Adjust the font size as needed
            ),
          ),
        ),
        SizedBox(
          height: 300,
          width: 800,
          child: ListView(
            shrinkWrap: true,
            children: const <Widget>[
              _PlayersCard(fname: "Thierry", lname: "Beaulieu"),
              _PlayersCard(fname: "Sulayman", lname: "Hosna"),
              _PlayersCard(fname: "Ahmed", lname: "Ben-Othman"),
              _PlayersCard(fname: "Samy", lname: "Labassi"),
            ],
          ),
        ),
      ],
    );
  }
}
