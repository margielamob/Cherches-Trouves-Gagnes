import 'package:app/domain/services/game_replay_service.dart';
import 'package:app/domain/services/video_replay_service.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class VideoPlayer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final videoReplayService = Provider.of<VideoReplayService>(context);
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
                      min: videoReplayService.beginTime,
                      max: videoReplayService.endTime,
                      value: videoReplayService.currentTime,
                      onChanged: (double value) {
                        videoReplayService.updateCurrentTime(value);
                      },
                    ),
                  ),
                  SizedBox(width: 20),
                  IconButton(
                    icon: videoReplayService.currentIcon,
                    onPressed: () {
                      videoReplayService.play();
                    },
                  ),
                  SizedBox(width: 20),
                  IconButton(
                    icon: Icon(Icons.replay),
                    onPressed: () {
                      videoReplayService.replay();
                    },
                  ),
                  ToggleButtons(
                    isSelected: videoReplayService.selectedSpeed,
                    children: [
                      Text("x0.5"),
                      Text("x1"),
                      Text("x2"),
                      Text("x3")
                    ],
                    onPressed: (int index) {
                      videoReplayService.updateSelectedSpeed(index);
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
