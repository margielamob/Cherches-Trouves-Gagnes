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
