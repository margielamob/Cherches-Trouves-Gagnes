import 'package:app/components/game_avatar.dart';
import 'package:app/domain/models/user_model.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class _PlayersCard extends StatelessWidget {
  final UserModel player;
  const _PlayersCard({required this.player});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 250,
      height: 40,
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
                  GameAvatar(
                    photoURL: player.avatar,
                  ),
                  SizedBox(width: 10),
                  Text(player.name, style: TextStyle(fontSize: 16))
                ],
              ),
              SizedBox(height: 5),
              Text('Différences trouvées : ${player.nbDifferenceFound}'),
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
    final gameManagerService = Provider.of<GameManagerService>(context);

    return SizedBox(
      height: 90,
      width: 1000,
      child: Column(
        children: [
          Expanded(
            child: Center(
              child: ListView.builder(
                shrinkWrap: true,
                scrollDirection: Axis.horizontal,
                itemCount: gameManagerService.players.length,
                itemBuilder: (_, index) {
                  return _PlayersCard(
                      player: gameManagerService.players[index]);
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
