class LimitedGameModel {
  String? id;
  int timer;
  int bonus;

  LimitedGameModel(
      {required this.id, required this.timer, required this.bonus});

  factory LimitedGameModel.fromJson(Map<String, dynamic> json) {
    return LimitedGameModel(
      id: json['id'],
      timer: json['timer'],
      bonus: json['bonus'],
    );
  }
}
