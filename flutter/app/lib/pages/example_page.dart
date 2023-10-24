import 'package:app/domain/services/example_service.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class Example extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ExampleService(),
      child: Consumer<ExampleService>(
          builder: (context, state, ___) => Column(
                children: [
                  SizedBox(height: 20),
                  Text("This is the value obtained ${state.state.counter}"),
                  SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      FilledButton(
                        onPressed: () {
                          state.decrementCounter();
                        },
                        child: const Text('Decrement'),
                      ),
                      SizedBox(width: 20),
                      FilledButton(
                        onPressed: () {
                          state.incrementCounter();
                        },
                        child: const Text('Increment'),
                      ),
                    ],
                  ),
                ],
              )),
    );
  }
}
