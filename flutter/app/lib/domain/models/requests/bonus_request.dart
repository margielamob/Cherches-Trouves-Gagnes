class BonusRequest {
  final int bonus;

  BonusRequest({required this.bonus});

  factory BonusRequest.fromJson(Map<String, dynamic> json) {
    return BonusRequest(
      bonus: json['bonus'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'bonus': bonus,
    };
  }
}
