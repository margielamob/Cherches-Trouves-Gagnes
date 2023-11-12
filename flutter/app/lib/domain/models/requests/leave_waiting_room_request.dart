class LeaveWaitingRoomRequest {
  String roomId;
  String name;

  LeaveWaitingRoomRequest({
    required this.roomId,
    required this.name,
  });

  Map<String, dynamic> toJson() {
    return {
      'roomId': roomId,
      'name': name,
    };
  }
}
