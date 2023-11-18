import 'package:app/domain/services/game_replay_service.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class VideoPlayer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final gameReplayService = Provider.of<GameReplayService>(context);

    return gameReplayService.isModeReplayActivated
        ? Column(
            children: [
              SizedBox(height: 5),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 750,
                    child: Slider(
                      min: gameReplayService.replayBar.defaultBegin,
                      max: gameReplayService.replayBar.defaultEnd,
                      value: gameReplayService.replayBar.currentProgression,
                      onChanged: (double time) {
                        gameReplayService.updateCurrentProgression(time);
                      },
                    ),
                  ),
                  SizedBox(width: 20),
                  IconButton(
                    icon: gameReplayService.replayBar.currentIcon,
                    onPressed: () {
                      gameReplayService.handlePlayButton();
                    },
                  ),
                  SizedBox(width: 20),
                  IconButton(
                    icon: Icon(Icons.replay),
                    onPressed: () {
                      gameReplayService.replay();
                    },
                  ),
                  ToggleButtons(
                    isSelected: gameReplayService.replayBar.selectedSpeed,
                    children: [
                      Text("x0.5"),
                      Text("x1"),
                      Text("x2"),
                      Text("x3")
                    ],
                    onPressed: (int index) {
                      gameReplayService.updateSelectedSpeed(index);
                    },
                  )
                ],
              ),
              SizedBox(height: 5),
            ],
          )
        : Container();
  }
}
