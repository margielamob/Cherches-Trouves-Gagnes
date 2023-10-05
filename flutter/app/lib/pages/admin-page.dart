import 'package:app/services/application-bar.dart';
import 'package:flutter/material.dart';

class AdminPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBarBuilder.buildBar(
        context,
      ),
    );
  }
}
