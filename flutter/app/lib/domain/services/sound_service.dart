import 'package:audioplayers/audioplayers.dart';

class SoundService {
  final AudioPlayer audioPlayer;
  SoundService() : audioPlayer = AudioPlayer();

  playDifferenceFound() async {
    try {
      await audioPlayer.stop();
      await audioPlayer.play(AssetSource('sounds/correctanswer.wav'));
    } catch (e) {
      print('Error playing correctanswer.wav: $e');
    }
  }

  playDifferenceNotFound() async {
    try {
      await audioPlayer.stop();
      await audioPlayer.play(AssetSource('sounds/wronganswer.wav'));
    } catch (e) {
      print('Error playing wronganswer.wav: $e');
    }
  }
}
