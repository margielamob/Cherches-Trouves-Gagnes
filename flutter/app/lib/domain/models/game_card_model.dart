import 'dart:convert';
import 'dart:typed_data';

class GameCardModel {
  String id;
  String title;
  Uint8List thumbnail;
  int nbDifferences;
  String idEditedBmp;
  String idOriginalBmp;

  GameCardModel({
    required this.id,
    required this.title,
    required this.thumbnail,
    required this.nbDifferences,
    required this.idEditedBmp,
    required this.idOriginalBmp,
  });

  factory GameCardModel.fromJson(Map json) {
    return GameCardModel(
      id: json['id'],
      title: json['name'],
      thumbnail: base64Decode(json['thumbnail'].split(',').last),
      nbDifferences: json['nbDifferences'],
      idEditedBmp: json['idEditedBmp'],
      idOriginalBmp: json['idOriginalBmp'],
    );
  }
}
