import 'dart:convert';
import 'dart:typed_data';

class GameCardData {
  String id;
  String title;
  Uint8List thumbnail;

  GameCardData({
    required this.id,
    required this.title,
    required this.thumbnail,
  });

  factory GameCardData.fromJson(Map json) {
    return GameCardData(
      id: json['id'],
      title: json['name'],
      thumbnail: base64Decode(json['thumbnail'].split(',').last),
    );
  }
}
