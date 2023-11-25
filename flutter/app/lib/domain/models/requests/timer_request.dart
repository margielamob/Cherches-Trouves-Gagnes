class TimerRequest {
  final int timer;

  TimerRequest({required this.timer});

  factory TimerRequest.fromJson(Map<String, dynamic> json) {
    return TimerRequest(
      timer: json['timer'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'timer': timer,
    };
  }
}
