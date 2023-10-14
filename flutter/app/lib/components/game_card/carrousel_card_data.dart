class GameCardData {
  String id;
  String title;
  String thumbnail;

  GameCardData({
    required this.id,
    required this.title,
    required this.thumbnail,
  });

  factory GameCardData.fromJson(Map json) {
    return GameCardData(
      id: json['id'],
      title: json['name'],
      thumbnail: json['thumbnail'],
    );
  }
}
