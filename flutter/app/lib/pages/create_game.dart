import 'package:app/components/video_player.dart';
import 'package:flutter/material.dart';

class CreateGamePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Create Game'),
        ),
        body: Center(child: VideoPlayer()));
  }
}
