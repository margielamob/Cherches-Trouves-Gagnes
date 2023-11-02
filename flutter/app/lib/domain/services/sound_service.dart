import 'package:audioplayers/audioplayers.dart';

class SoundService {
  final AudioPlayer audioPlayer;
  SoundService() : audioPlayer = AudioPlayer();

  playDifferenceFound() async {
    await audioPlayer.play(DeviceFileSource('assets/sounds/correctAnswer.wav'));
  }

  playDifferenceNotFound() async {
    await audioPlayer.play(DeviceFileSource('assets/sounds/wrongAnswer.wav'));
  }
}
