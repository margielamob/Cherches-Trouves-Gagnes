import 'package:app/domain/services/difference_detection_service.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';

void main() {
  group('DifferenceDetectionService Tests', () {
    setUp(() {
      Get.testMode = true;
      Get.put<DifferenceDetectionService>(DifferenceDetectionService());
    });
  });
}
