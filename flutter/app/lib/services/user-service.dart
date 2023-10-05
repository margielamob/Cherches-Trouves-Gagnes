import 'package:cloud_firestore/cloud_firestore.dart';

// interface user
class UserData {
  final String uid;
  final String displayName;
  final String email;
  final bool emailVerified;
  final String? photoURL;
  final String? phoneNumber;
  final String? theme;
  final String? language;
  final int gameLost;
  final int gameWins;
  final int gamePlayed;
  final String? averageTime;

  UserData({
    required this.uid,
    required this.displayName,
    required this.email,
    this.emailVerified = false,
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
      'emailVerified': emailVerified,
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
}

class UserService {
  FirebaseFirestore db = FirebaseFirestore.instance;

  Future<void> addUser(UserData user) async {
    CollectionReference users = db.collection('users');
    return users
        .doc(user.uid)
        .set(user.toMap())
        .catchError((error) => print("Failed to add user: $error"));
  }

  Future<bool> isUserNameAvailable(String userName) async {
    final CollectionReference users =
        FirebaseFirestore.instance.collection('users');
    final QuerySnapshot result =
        await users.where('displayName', isEqualTo: userName).get();

    return result.docs.isEmpty;
  }

  Future<DocumentSnapshot?> getUserByDisplayName(String displayName) async {
    final CollectionReference users =
        FirebaseFirestore.instance.collection('users');
    final QuerySnapshot result =
        await users.where('displayName', isEqualTo: displayName).get();

    if (result.docs.isEmpty) {
      return null;
    }

    return result.docs.first;
  }
}