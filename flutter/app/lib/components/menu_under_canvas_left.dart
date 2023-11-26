import 'package:app/domain/services/drawing_service_left.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class MenuUnderCanvasLeft extends StatelessWidget {
  final DrawingServiceLeft drawingServiceLeft = Get.find();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        FilledButton(
          onPressed: () {
            drawingServiceLeft.clearStrokes();
          },
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Icon(Icons.layers_clear),
            ],
          ),
        ),
        SizedBox(width: 50),
        SelectBackGroundButton(),
        SizedBox(width: 50),
        FilledButton(
          onPressed: () {
            drawingServiceLeft.removeBackgroundImage();
          },
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Image.asset(
                'assets/image_not_working.png',
                width: 22.0,
                height: 22.0,
              ),
              SizedBox(width: 8.0),
            ],
          ),
        ),
      ],
    );
  }
}

class SelectBackGroundButton extends StatelessWidget {
  final DrawingServiceLeft drawingServiceLeft = Get.find();

  Future<bool> fetchDifferenceVignette() async {
    return await drawingServiceLeft.setBackgroundImage();
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
