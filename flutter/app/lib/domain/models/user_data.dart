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
  final List<String>? friends;

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
    this.friends,
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
      'friends': friends,
    };
  }

  factory UserData.fromMap(Map<String, dynamic> data) {
    List<String> friendsList = [];
    if (data['friends'] != null) {
      var dynamicList = data['friends'] as List<dynamic>;
      friendsList = dynamicList.map((item) => item.toString()).toList();
    }
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
      friends: friendsList,
    );
  }

  factory UserData.fromSnapshot(DocumentSnapshot snapshot) {
    final data = snapshot.data() as Map<String, dynamic>;
    List<String>? friendsList;

    if (data['friends'] != null) {
      var dynamicList = data['friends'] as List<dynamic>;
      friendsList = dynamicList.cast<String>().toList();
    }

    return UserData.fromMap({
      'uid': snapshot.id,
      'friends': friendsList,
      ...data,
    });
  }
}
