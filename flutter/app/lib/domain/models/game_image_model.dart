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
