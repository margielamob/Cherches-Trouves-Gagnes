import 'package:app/domain/services/difference_generator_service.dart';
import 'package:app/domain/services/generate_difference_slider_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class GenerateDifferencesButton extends StatelessWidget {
  final DifferenceGeneratorService differenceGeneratorService = Get.find();
  GenerateDifferencesButton();

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: () {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            final differenceSliderService =
                Provider.of<GenerateDifferenceSliderService>(context);

            return AlertDialog(
              title: Text('Random Differences to Generate :'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                      'Number of differences : ${differenceSliderService.differencesSlider.getValue().round()}'),
                  SizedBox(
                    width: 300,
                    child: Slider(
                      min: differenceSliderService.differencesSlider.minimum,
                      max: differenceSliderService.differencesSlider.maximum,
                      value: differenceSliderService
                          .differencesSlider.currentProgression,
                      onChanged: (double progression) {
                        differenceSliderService.updateProgression(progression);
                      },
                    ),
                  ),
                ],
              ),
              actions: <Widget>[
                FilledButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  child: Text('Close'),
                ),
                FilledButton(
                    onPressed: () {
                      differenceGeneratorService.generateDifferences();
                      Navigator.of(context).pop();
                    },
                    child: Text("ok")),
              ],
            );
          },
        );
      },
      child: Row(
        children: [
          Text("Generate Differences"),
          SizedBox(width: 10),
          Icon(Icons.shuffle)
        ],
      ),
    );
  }
}
