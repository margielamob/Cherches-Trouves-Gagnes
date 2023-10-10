class Score {
  final String playerName;
  final int time;
  final String type;
  const Score({
    required this.playerName,
    required this.time,
    required this.type,
  });

  factory Score.fromJson(Map json) {
    return Score(
      playerName: json['playerName'],
      time: json['time'],
      type: json['type'],
    );
  }
}
