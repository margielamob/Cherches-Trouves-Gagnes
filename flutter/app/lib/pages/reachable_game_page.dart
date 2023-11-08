import 'package:app/components/custom_app_bar.dart';
import 'package:app/components/reachable_games_carrousel.dart';
import 'package:flutter/material.dart';

class ReachableGamePage extends StatelessWidget {
  final bool enabled = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar.buildLogoutOnly(context, 'Games available'),
      body: Padding(
        padding: EdgeInsets.all(20.0),
        child: ReachableGamesCarrousel(),
      ),
    );
  }
}
