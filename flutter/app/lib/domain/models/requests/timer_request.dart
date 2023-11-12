class TimerRequest {
  final int time;

  TimerRequest({required this.time});

  factory TimerRequest.fromJson(Map<String, dynamic> json) {
    return TimerRequest(
      time: json['time'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'time': time,
    };
  }
}
