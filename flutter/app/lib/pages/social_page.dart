import 'package:flutter/material.dart';

class SocialPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Page Social'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/users');
              },
              child: Text('Chercher Utilisateur'),
            ),
            SizedBox(height: 20), // Espace entre les boutons
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/friendReq');
              },
              child: Text('Demandes d\'Ami'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/friendList');
              },
              child: Text('Liste d\'Amis'),
            ),
          ],
        ),
      ),
    );
  }
}
