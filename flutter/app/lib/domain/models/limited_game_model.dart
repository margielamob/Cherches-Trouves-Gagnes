class LimitedGameModel {
  void id;
  int timer;
  int bonus;

  LimitedGameModel(
      {required this.id, required this.timer, required this.bonus});

  factory LimitedGameModel.fromJson(Map<String, dynamic> json) {
    return LimitedGameModel(
      id: null,
      timer: json['timer'],
      bonus: json['bonus'],
    );
  }
}
