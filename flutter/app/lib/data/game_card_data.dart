import 'dart:convert';
import 'dart:typed_data';

class GameCardData {
  String id;
  String title;
  String thumbnail;
  Uint8List imageBytes;

  GameCardData({
    required this.id,
    required this.title,
    required this.thumbnail,
    required this.imageBytes,
  });

  factory GameCardData.fromJson(Map json) {
    return GameCardData(
      id: json['id'],
      title: json['name'],
      thumbnail: json['thumbnail'],
      imageBytes: base64Decode(json['thumbnail'].split(',').last),
    );
  }
}
