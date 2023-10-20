class GameImageModel {
  final String content;

  const GameImageModel({
    required this.content,
  });

  factory GameImageModel.fromJson(Map json) {
    return GameImageModel(
      content: json['image'],
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
