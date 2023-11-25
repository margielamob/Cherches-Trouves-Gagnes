import 'package:app/domain/services/game_replay_service.dart';
import 'package:app/domain/services/global_variables.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class VideoPlayer extends StatelessWidget {
  final GlobalVariables global = Get.find();

  @override
  Widget build(BuildContext context) {
    final gameReplayService = Provider.of<GameReplayService>(context);

    return global.isModeReplayActivated
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
                      onChangeStart: (double time) {
                        gameReplayService.handleOnChangeStart();
                      },
                      onChanged: (double time) {
                        gameReplayService.updateProgressBarUI(time, true);
                      },
                      onChangeEnd: (double time) {
                        gameReplayService.playFrom(time);
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
                      Text("x1"),
                      Text("x2"),
                      Text("x4"),
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
