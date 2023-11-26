import 'package:app/components/difference_vignette_modal.dart';
import 'package:app/domain/services/http_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SubmissionBoxNewDrawing extends StatelessWidget {
  final HttpService httpService = Get.find();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 40,
      width: 200,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [EnlargementRadiusSelection()],
      ),
    );
  }
}
