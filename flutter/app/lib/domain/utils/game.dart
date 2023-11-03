class Game {
  String card;
  bool isMulti;

  Game({required this.card, required this.isMulti});

  factory Game.fromJson(Map<String, dynamic> json) {
    return Game(
      card: json['card'],
      isMulti: json['bool'],
    );
  }
}
