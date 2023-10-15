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

// Ce ne devrait peut-être pas de la responsabilité 
// de la classe de donnéees de traiter l'information
// c'est plûtot la responsabilité d'une service
// import 'package:lzstring/lzstring.dart';

// Il y a une fonction qui se nomme decompressImage
// C'est elle qui décompresse les images du serveur.
// play-area.component.ts

// Future<String?> decompressedString = LZString.decompress(compressedString);
