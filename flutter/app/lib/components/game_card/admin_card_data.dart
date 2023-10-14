class AdminCardData {
  String id;
  String title;
  String thumbnail;

  AdminCardData({
    required this.id,
    required this.title,
    required this.thumbnail,
  });

  factory AdminCardData.fromJson(Map json) {
    return AdminCardData(
      id: json['id'],
      title: json['name'],
      thumbnail: json['thumbnail'],
    );
  }
}
