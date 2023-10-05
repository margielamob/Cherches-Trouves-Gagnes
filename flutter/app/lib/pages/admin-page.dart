import 'package:app/services/app-bar-service.dart';
import 'package:flutter/material.dart';

class AdminPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBarService.buildBar(
        context,
      ),
    );
  }
}
