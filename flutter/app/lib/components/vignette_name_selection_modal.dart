import 'package:app/domain/services/vignette_submission_service.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class VignetteNameSelectionModal extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final vignetteSubmissionService =
        Provider.of<VignetteSubmissionService>(context);

    return AlertDialog(
      title: Text("Give a name to your new game 🎉"),
      content: Container(
        constraints: BoxConstraints(maxHeight: 90),
        child: Column(
          children: [
            TextField(
              onChanged: ((value) {
                vignetteSubmissionService.changeGameName(value);
              }),
              decoration: InputDecoration(labelText: 'Name'),
            ),
          ],
        ),
      ),
      actions: [
        FilledButton(
          onPressed: () => Navigator.pop(context, 'Cancel'),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: vignetteSubmissionService.isGameNameValid()
              ? () async {
                  await vignetteSubmissionService.submitNewGame();
                  Navigator.of(context).pop('OK');
                }
              : null,
          child: Text("OK"),
        ),
      ],
    );
  }
}
