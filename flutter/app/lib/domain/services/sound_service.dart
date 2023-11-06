import 'package:audioplayers/audioplayers.dart';

class SoundService {
  final AudioPlayer audioPlayer;
  SoundService() : audioPlayer = AudioPlayer();

  playDifferenceFound() async {
    await audioPlayer.play(AssetSource('sounds/correctanswer.wav'));
  }

  playDifferenceNotFound() async {
    await audioPlayer.play(AssetSource('sounds/wronganswer.wav'));
  }
}
