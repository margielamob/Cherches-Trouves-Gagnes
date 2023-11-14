import 'package:cloud_firestore/cloud_firestore.dart';

class UserData {
  final String uid;
  String displayName;
  final String email;
  final String? photoURL;
  final String? phoneNumber;
  String? theme;
  String? language;
  final int gameLost;
  final int gameWins;
  final int gamePlayed;
  final String? averageTime;

  UserData({
    required this.uid,
    required this.displayName,
    required this.email,
    this.photoURL,
    this.phoneNumber,
    this.theme,
    this.language,
    this.gameLost = 0,
    this.gameWins = 0,
    this.gamePlayed = 0,
    this.averageTime,
  });

  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'displayName': displayName,
      'email': email,
      'photoURL': photoURL,
      'phoneNumber': phoneNumber,
      'theme': theme,
      'language': language,
      'gameLost': gameLost,
      'gameWins': gameWins,
      'gamePlayed': gamePlayed,
      'averageTime': averageTime,
    };
  }

  factory UserData.fromMap(Map<String, dynamic> data) {
    return UserData(
      uid: data['uid'] ?? '',
      displayName: data['displayName'] ?? '',
      email: data['email'] ?? '',
      photoURL: data['photoURL'] ?? '',
      phoneNumber: data['phoneNumber'] ?? '',
      theme: data['theme'] ?? '',
      language: data['language'] ?? '',
      gameLost: data['gameLost'] ?? 0,
      gameWins: data['gameWins'] ?? 0,
      gamePlayed: data['gamePlayed'] ?? 0,
      averageTime: data['averageTime'] ?? '',
    );
  }

  factory UserData.fromSnapshot(DocumentSnapshot snapshot) {
    final data = snapshot.data() as Map<String, dynamic>;

    return UserData.fromMap({
      'uid': snapshot.id,
      ...data,
    });
  }
}
