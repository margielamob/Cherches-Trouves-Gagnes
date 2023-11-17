class InitialTimerRequest {
  int startingTime;

  InitialTimerRequest({required this.startingTime});

  Map<String, dynamic> toJson() {
    return {
      "startingTime": startingTime,
    };
  }
}
