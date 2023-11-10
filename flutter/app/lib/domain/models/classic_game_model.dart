class ClassicGameModel {
  String id;
  bool cheatMode;
  int timer;

  ClassicGameModel(
      {required this.id, required this.cheatMode, required this.timer});

  factory ClassicGameModel.fromJson(Map<String, dynamic> json) {
    return ClassicGameModel(
      id: json['id'],
      cheatMode: json['cheatMode'],
      timer: json['timer'],
    );
  }
}
