class ScoreData {
  final String playerName;
  final int time;
  final String type;
  const ScoreData({
    required this.playerName,
    required this.time,
    required this.type,
  });

  factory ScoreData.fromJson(Map json) {
    return ScoreData(
      playerName: json['playerName'],
      time: json['time'],
      type: json['type'],
    );
  }
}
