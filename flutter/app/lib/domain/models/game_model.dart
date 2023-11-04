class GameModel {
  String card;
  bool isMulti;

  GameModel({required this.card, required this.isMulti});

  factory GameModel.fromJson(Map<String, dynamic> json) {
    return GameModel(
      card: json['card'],
      isMulti: json['bool'],
    );
  }
}
