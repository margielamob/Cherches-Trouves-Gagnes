import 'dart:async';

import 'package:app/components/image_border.dart';
import 'package:app/components/vignette_name_selection_modal.dart';
import 'package:app/domain/models/requests/vignette_created_request.dart';
import 'package:app/domain/services/vignette_submission_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class DifferenceVignetteModal extends StatelessWidget {
  final VignetteSubmissionService submissionService = Get.find();

  Future<DifferenceVignetteResponse?> fetchDifferenceVignette() async {
    return await submissionService.getDifferenceImage();
  }

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: () => showDialog<String>(
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
                return Center(child: CircularProgressIndicator());
              case ConnectionState.done:
                if (snapshot.hasError || snapshot.data == null) {
                  return AlertDialog(
                    title: const Text('Error'),
                    content: Column(
                      children: [
                        Text('Error: ${snapshot.error}'),
                      ],
                    ),
                    actions: <Widget>[
                      TextButton(
                        onPressed: () => Navigator.pop(context, 'OK'),
                        child: const Text('Close'),
                      ),
                    ],
                  );
                } else {
                  return AlertDialog(
                    title: const Text('Differences produced'),
                    content: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            Text(
                                "There are ${snapshot.data!.nbDifference} differences")
                          ],
                        ),
                        ImageBorder.forSizeBox(
                          color: Colors.black,
                          width: 1.0,
                          sizeBoxChild: SizedBox(
                            width: 640,
                            height: 480,
                            child: Image.memory(
                              snapshot.data!.differenceImage,
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                      ],
                    ),
                    actions: <Widget>[
                      TextButton(
                        onPressed: () => Navigator.pop(context, 'Cancel'),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () {
                          Navigator.pop(context, 'OK');
                          showDialog(
                            context: context,
                            barrierDismissible: false,
                            builder: (BuildContext context) {
                              return VignetteNameSelectionModal();
                            },
                          );
                        },
                        child: const Text('Create'),
                      ),
                    ],
                  );
                }
            }
          },
        ),
      ),
      child: Row(
        children: [Text("Submit"), SizedBox(width: 10), Icon(Icons.send)],
      ),
    );
  }
}
