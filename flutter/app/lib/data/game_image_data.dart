import 'package:lzstring/lzstring.dart';

class GameImage {
  final String image;

  const GameImage({
    required this.image,
  });

  factory GameImage.fromJson(Map json) {
    return GameImage(
      image: json['image'],
    );
  }
}

// Il y a une fonction qui se nomme decompressImage
// C'est elle qui décompresse les images du serveur.
// play-area.component.ts

// Future<String?> decompressedString = LZString.decompress(compressedString);
