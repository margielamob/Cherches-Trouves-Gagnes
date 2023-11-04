import 'package:app/domain/services/example_service.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group("Example service", () {
    late ExampleService exampleService;

    setUp(() {
      exampleService = ExampleService();
    });

    test('ExampleService should have a counter equal to zero at first', () {
      expect(exampleService.state.counter, 0);
    });

    test('decrementCounter should decrement the counter', () {
      exampleService.decrementCounter();
      expect(exampleService.state.counter, -1);
    });

    test('incrementCounter should increment the counter', () {
      exampleService.incrementCounter();
      expect(exampleService.state.counter, 1);
    });
  });
}
