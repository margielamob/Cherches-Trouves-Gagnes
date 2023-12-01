import 'dart:async';
import 'dart:typed_data';

import 'package:app/components/image_border.dart';
import 'package:app/domain/models/requests/vignette_created_request.dart';
import 'package:app/domain/services/drawing_service_left.dart';
import 'package:app/domain/services/drawing_service_right.dart';
import 'package:app/domain/services/pencil_box_manager.dart';
import 'package:app/domain/services/radius_slider_service.dart';
import 'package:app/domain/services/vignette_submission_service.dart';
import 'package:app/pages/main_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class DifferenceVignetteModal extends StatelessWidget {
  final VignetteSubmissionService submissionService = Get.find();

  Future<DifferenceVignetteResponse?> fetchDifferenceVignette() async {
    return await submissionService.getDifferenceImage();
  }

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: () {
        Navigator.of(context).pop();
        showDialog<String>(
          context: context,
          barrierDismissible: false,
          builder: (BuildContext context) => FutureBuilder(
            future: fetchDifferenceVignette(),
            builder: (BuildContext context,
                AsyncSnapshot<DifferenceVignetteResponse?> snapshot) {
              switch (snapshot.connectionState) {
                case ConnectionState.active:
                case ConnectionState.none:
                case ConnectionState.waiting:
                  return Center(
                    child: WillPopScope(
                      onWillPop: () async => false,
                      child: CircularProgressIndicator(),
                    ),
                  );
                case ConnectionState.done:
                  if (snapshot.hasError || snapshot.data == null) {
                    return ErrorNewVignetteCreation();
                  } else if (snapshot.data!.statusCode == 406) {
                    return RejectionModalDifferenceVignette();
                  } else if (snapshot.data!.nbDifference != null &&
                      snapshot.data!.differenceImage != null) {
                    return DifferenceVignetteModalContent(
                        nbDifference: snapshot.data!.nbDifference!,
                        image: snapshot.data!.differenceImage!);
                  } else {
                    return ErrorNewVignetteCreation();
                  }
              }
            },
          ),
        );
      },
      child: Text("Continue"),
    );
  }
}

class EnlargementRadiusSelection extends StatelessWidget {
  EnlargementRadiusSelection();

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: () {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            final radiusService = Provider.of<RadiusSliderService>(context);
            return AlertDialog(
              title: Text('Select an enlargement radius'),
              content: WillPopScope(
                onWillPop: () async => false,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                        'Radius : ${radiusService.radiusSlider.getValue()} px'),
                    SizedBox(
                      width: 300,
                      child: Slider(
                        min: radiusService.radiusSlider.minimum,
                        max: radiusService.radiusSlider.maximum,
                        value: radiusService.radiusSlider.currentProgression,
                        onChanged: (double progression) {
                          radiusService.updateProgression(progression);
                        },
                      ),
                    ),
                  ],
                ),
              ),
              actions: <Widget>[
                FilledButton(
                  onPressed: () {
                    Navigator.of(context).pop(); // Close the dialog
                  },
                  child: Text('Close'),
                ),
                DifferenceVignetteModal(),
              ],
            );
          },
        );
      },
      child: Row(
        children: [Text("Submit"), SizedBox(width: 10), Icon(Icons.send)],
      ),
    );
  }
}

class RejectionModalDifferenceVignette extends StatelessWidget {
  RejectionModalDifferenceVignette();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Error message'),
      content: WillPopScope(
        onWillPop: () async => false,
        child: const Text("You need between 3 and 9 differences"),
      ),
      actions: <Widget>[
        FilledButton(
          onPressed: () => Navigator.pop(context, 'OK'),
          child: const Text('Close'),
        ),
      ],
    );
  }
}

class DifferenceVignetteModalContent extends StatelessWidget {
  final int nbDifference;
  final Uint8List image;

  DifferenceVignetteModalContent(
      {required this.nbDifference, required this.image});

  @override
  Widget build(BuildContext context) {
    final vignetteSubmissionService =
        Provider.of<VignetteSubmissionService>(context);

    return AlertDialog(
      title: const Text('Differences produced'),
      content: SingleChildScrollView(
        child: WillPopScope(
          onWillPop: () async => false,
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [Text("There are $nbDifference differences")],
              ),
              ImageBorder.forSizeBox(
                color: Colors.black,
                width: 1.0,
                sizeBoxChild: SizedBox(
                  width: 533,
                  height: 400,
                  child: Image.memory(
                    image,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              Row(
                children: [
                  Column(
                    children: [
                      SizedBox(height: 15),
                      Text("Give your new game a new!"),
                      SizedBox(
                        width: 200,
                        child: TextField(
                          maxLength: 20,
                          onChanged: ((value) {
                            vignetteSubmissionService.changeGameName(value);
                          }),
                          decoration: InputDecoration(labelText: 'Name'),
                        ),
                      ),
                    ],
                  ),
                ],
              )
            ],
          ),
        ),
      ),
      actions: <Widget>[
        FilledButton(
          onPressed: () {
            Navigator.pop(context, 'Cancel');
            vignetteSubmissionService.changeGameName("");
          },
          child: const Text('Cancel'),
        ),
        FeedBackFromVignetteSubmission(),
      ],
    );
  }
}

class FeedBackFromVignetteSubmission extends StatelessWidget {
  final VignetteSubmissionService submissionService = Get.find();

  Future<bool> submitNewGame() async {
    return await submissionService.submitNewGame();
  }

  @override
  Widget build(BuildContext context) {
    final vignetteSubmissionService =
        Provider.of<VignetteSubmissionService>(context);

    return FilledButton(
      onPressed: vignetteSubmissionService.isGameNameValid()
          ? () {
              Navigator.pop(context, 'OK');
              showDialog<String>(
                context: context,
                barrierDismissible: false,
                builder: (BuildContext context) => FutureBuilder(
                  future: submitNewGame(),
                  builder:
                      (BuildContext context, AsyncSnapshot<bool> snapshot) {
                    switch (snapshot.connectionState) {
                      case ConnectionState.active:
                      case ConnectionState.none:
                      case ConnectionState.waiting:
                        return Center(
                          child: WillPopScope(
                            onWillPop: () async => false,
                            child: CircularProgressIndicator(),
                          ),
                        );
                      case ConnectionState.done:
                        if (snapshot.hasError ||
                            snapshot.data == null ||
                            snapshot.data == false) {
                          return ErrorNewVignetteCreation();
                        } else {
                          return SubmissionConfirmationModalContent();
                        }
                    }
                  },
                ),
              );
            }
          : null,
      child: Text("Submit"),
    );
  }
}

class SubmissionConfirmationModalContent extends StatelessWidget {
  final DrawingServiceLeft drawingServiceLeft = Get.find();
  final DrawingServiceRight drawingServiceRight = Get.find();
  final PencilBoxManager pencilBox = Get.find();

  SubmissionConfirmationModalContent();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: WillPopScope(
        onWillPop: () async => false,
        child: const Text('Congrats! A new game was created!'),
      ),
      actions: <Widget>[
        FilledButton(
          onPressed: () {
            pencilBox.resetForNewDrawing();
            drawingServiceLeft.resetForNewDrawing();
            drawingServiceRight.resetForNewDrawing();
            Get.offAll(MainPage());
          },
          child: const Text('Done'),
        ),
      ],
    );
  }
}

class ErrorModalEasterEgg extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Error message'),
      content: Column(children: [
        Text("A problem happened and it's because of him"),
        ImageBorder.forSizeBox(
          color: Colors.black,
          width: 1.0,
          sizeBoxChild: SizedBox(
            width: 400,
            height: 300,
            child: Image.asset(
              'assets/easter_egg.jpg',
              width: 400,
              height: 300,
            ),
          ),
        ),
      ]),
      actions: <Widget>[
        FilledButton(
          onPressed: () => Get.offAll(MainPage()),
          child: const Text('Close'),
        ),
      ],
    );
  }
}

class ErrorNewVignetteCreation extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Error message'),
      content: Column(children: [
        Text("Error during game creation"),
      ]),
      actions: <Widget>[
        FilledButton(
          onPressed: () => Get.offAll(MainPage()),
          child: const Text('Close'),
        ),
      ],
    );
  }
}
