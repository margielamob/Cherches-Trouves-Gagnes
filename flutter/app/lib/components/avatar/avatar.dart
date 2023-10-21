import 'package:flutter/material.dart';

class Avatar extends StatelessWidget {
  final String? photoURL;
  final VoidCallback? onTap;

  const Avatar({this.photoURL, this.onTap});

  @override
  Widget build(BuildContext context) {
    print(photoURL ?? 'null');
    return GestureDetector(
      onTap: onTap,
      child: Center(
        child: photoURL == null
            ? CircleAvatar(
                radius: 50.0,
                child: Icon(Icons.photo_camera),
              )
            : CircleAvatar(
                radius: 50.0,
                backgroundImage: NetworkImage(photoURL!),
              ),
      ),
    );
  }
}
