import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';

// interface user
class UserData {
  final String uid;
  final String displayName;
  final String email;
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
}

class UserService {
  FirebaseStorage storage = FirebaseStorage.instance;
  FirebaseFirestore db = FirebaseFirestore.instance;

  UserData? get currentUser => null;

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

  Future<void> updateUser(UserData user) async {
    CollectionReference users = db.collection('users');
    return users
        .doc(user.uid)
        .update(user.toMap())
        .catchError((error) => print("Failed to update user: $error"));
  }

  Future<void> deleteUser(UserData user) async {
    CollectionReference users = db.collection('users');
    return users
        .doc(user.uid)
        .delete()
        .catchError((error) => print("Failed to delete user: $error"));
  }

  Future<DocumentSnapshot?> getUserByUid(String uid) async {
    final CollectionReference users =
        FirebaseFirestore.instance.collection('users');
    final QuerySnapshot result = await users.where('uid', isEqualTo: uid).get();

    if (result.docs.isEmpty) {
      return null;
    }
    return result.docs.first;
  }

  Future<String> getPhotoURL(String uid) async {
    Reference ref = storage.ref().child('avatars/$uid/avatar.jpg');
    return ref.getDownloadURL();
  }

  Future<void> updateUserAvatar(String uid, String photoURL) async {
    CollectionReference users = db.collection('users');
    return users.doc(uid).update({'photoURL': photoURL}).catchError(
        (error) => print("Failed to update user: $error"));
  }
}
