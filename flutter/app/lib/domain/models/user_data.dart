import 'package:cloud_firestore/cloud_firestore.dart';

class UserData {
  final String uid;
  String displayName;
  final String email;
  final String? photoURL;
  final String? phoneNumber;
  String? theme;
  String? language;
  final int gameWins;
  final int numberDifferenceFound;
  final int totalTimePlayed;
  final int gamePlayed;

  UserData({
    required this.uid,
    required this.displayName,
    required this.email,
    this.photoURL,
    this.phoneNumber,
    this.theme,
    this.language,
    this.gameWins = 0,
    this.numberDifferenceFound = 0,
    this.totalTimePlayed = 0,
    this.gamePlayed = 0,
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
      'gameWins': gameWins,
      'numberDifferenceFound': numberDifferenceFound,
      'totalTimePlayed': totalTimePlayed,
      'gamePlayed': gamePlayed,
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
      gameWins: data['gameWins'] ?? 0,
      numberDifferenceFound: data['numberDifferenceFound'] ?? 0,
      totalTimePlayed: data['totalTimePlayed'] ?? '',
      gamePlayed: data['gamePlayed'] ?? 0,
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
