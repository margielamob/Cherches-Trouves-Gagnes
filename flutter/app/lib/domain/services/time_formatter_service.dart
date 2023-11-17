class TimeFormatterService {
  String format(int seconds, int precision) {
    final min = (seconds ~/ 60).toString();
    final sec = (seconds % 60).toString();
    return '${min.padLeft(precision, '0')}:${sec.padLeft(precision, '0')}';
  }
}
