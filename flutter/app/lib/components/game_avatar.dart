import 'package:flutter/material.dart';

class GameAvatar extends StatelessWidget {
  final String? photoURL;
  final VoidCallback? onTap;

  const GameAvatar({this.photoURL, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Center(
        child: photoURL == null
            ? CircleAvatar(
                radius: 10.0,
                child: Icon(Icons.photo_camera),
              )
            : photoURL!.startsWith('assets')
                ? CircleAvatar(
                    radius: 10.0,
                    backgroundImage: AssetImage(photoURL!),
                  )
                : CircleAvatar(
                    radius: 10.0,
                    backgroundImage: NetworkImage(photoURL!),
                  ),
      ),
    );
  }
}
