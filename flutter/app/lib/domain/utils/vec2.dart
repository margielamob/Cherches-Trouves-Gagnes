class Vec2 {
  int x;
  int y;

  Vec2({required this.x, required this.y});

  factory Vec2.fromJson(Map<String, dynamic> json) {
    return Vec2(
      x: json['x'],
      y: json['y'],
    );
  }
}
