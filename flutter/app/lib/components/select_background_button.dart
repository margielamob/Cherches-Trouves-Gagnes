import 'package:app/domain/services/drawing_service_left.dart';
import 'package:app/domain/services/drawing_service_right.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SelectBackGroundButton extends StatelessWidget {
  final DrawingServiceLeft drawingServiceLeft = Get.find();
  final DrawingServiceRight drawingServiceRight = Get.find();
  final bool shouldDrawLeft;
  final bool shouldDrawRight;

  SelectBackGroundButton(
      {required this.shouldDrawLeft, required this.shouldDrawRight});

  Future<bool> fetchDifferenceVignette() async {
    if (shouldDrawLeft && shouldDrawRight) {
      final backgroundImage = await drawingServiceLeft.fetchBackgroundImage();
      final resultRight =
          await drawingServiceRight.setNewBackgroundImage(backgroundImage);
      final resultLeft =
          await drawingServiceLeft.setNewBackgroundImage(backgroundImage);
      return resultRight && resultLeft;
    }
    if (shouldDrawLeft) {
      return await drawingServiceLeft.setBackgroundImage();
    }
    if (shouldDrawRight) {
      return await drawingServiceRight.setBackgroundImage();
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: () {
        showDialog<String>(
          context: context,
          barrierDismissible: false,
          builder: (BuildContext context) => FutureBuilder(
            future: fetchDifferenceVignette(),
            builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
              switch (snapshot.connectionState) {
                case ConnectionState.active:
                case ConnectionState.none:
                case ConnectionState.waiting:
                  return Center(child: CircularProgressIndicator());
                case ConnectionState.done:
                  if (snapshot.hasError || snapshot.data == null) {
                    return DimensionErrorModal();
                  } else if (!snapshot.data!) {
                    return DimensionErrorModal();
                  } else if (snapshot.data!) {
                    Navigator.of(context).pop();
                    return Container();
                  } else {
                    return DimensionErrorModal();
                  }
              }
            },
          ),
        );
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Icon(Icons.image),
        ],
      ),
    );
  }
}

class DimensionErrorModal extends StatelessWidget {
  DimensionErrorModal();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Error message'),
      content:
          const Text("The dimension of your image needs to be 640px x 480px"),
      actions: <Widget>[
        FilledButton(
          onPressed: () => Navigator.pop(context, 'OK'),
          child: const Text('Close'),
        ),
      ],
    );
  }
}
