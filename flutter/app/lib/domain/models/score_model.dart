class ScoreModel {
  final String playerName;
  final int time;
  final String type;

  const ScoreModel({
    required this.playerName,
    required this.time,
    required this.type,
  });

  factory ScoreModel.fromJson(Map json) {
    return ScoreModel(
      playerName: json['playerName'],
      time: json['time'],
      type: json['type'],
    );
  }
}
