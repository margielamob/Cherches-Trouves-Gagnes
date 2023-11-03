class GameModeModel {
  final String modeName;

  GameModeModel({required this.modeName});

  factory GameModeModel.fromJson(Map<String, dynamic> json) {
    return GameModeModel(modeName: json['mode'] as String);
  }

  Map<String, dynamic> toJson() {
    return {
      'mode': modeName,
    };
  }
}
