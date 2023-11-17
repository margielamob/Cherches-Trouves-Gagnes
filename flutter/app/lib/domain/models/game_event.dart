import 'package:app/domain/models/requests/difference_found_message.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:get/get.dart';

abstract class GameEvent {
  DifferenceDetectionService differenceDetectionService = Get.find();
  DateTime timeStamp;
  int relativeTimeStampMs = 0;

  GameEvent({required this.timeStamp});

  void execute();
}

class DifferenceFoundEvent extends GameEvent {
  DifferenceFoundMessage differenceData;

  DifferenceFoundEvent({required timeStamp, required this.differenceData})
      : super(timeStamp: timeStamp);

  @override
  void execute() {
    differenceDetectionService.showDifferenceFound(differenceData);
    print('Difference found at ${timeStamp.toString()}');
  }
}

class DifferenceNotFoundEvent extends GameEvent {
  DifferenceNotFoundEvent({required DateTime timeStamp})
      : super(timeStamp: timeStamp);

  @override
  void execute() {
    differenceDetectionService.showDifferenceNotFound();
    print('Difference not found at ${timeStamp.toString()}');
  }
}

class GameStartedEvent extends GameEvent {
  GameStartedEvent({required DateTime timeStamp}) : super(timeStamp: timeStamp);

  @override
  void execute() {
    print('Game started at ${timeStamp.toString()}');
  }
}

class GameEndEvent extends GameEvent {
  GameEndEvent({required DateTime timeStamp}) : super(timeStamp: timeStamp);

  @override
  void execute() {
    print('Game ended at ${timeStamp.toString()}');
  }
}
