import 'dart:typed_data';

import 'package:app/domain/models/user_data.dart';
import 'package:camera/camera.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:image_picker/image_picker.dart';

class PersonalUserService {
  FirebaseStorage storage = FirebaseStorage.instance;
  FirebaseFirestore db = FirebaseFirestore.instance;
  String language = "En";
  String? avatar;

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

  Future<void> uploadAvatar(String uid, XFile imagePathXFile) async {
    Uint8List imageBytes = await imagePathXFile.readAsBytes();
    Reference ref = storage.ref().child('avatars/$uid/avatar.jpg');
    UploadTask uploadTask = ref.putData(imageBytes);
    await uploadTask.whenComplete(() => null);
    updateUserAvatar(uid, 'avatars/$uid/avatar.jpg');
  }

  Future<String> getUserTheme(String uid) async {
    CollectionReference users = FirebaseFirestore.instance.collection('users');
    DocumentSnapshot documentSnapshot = await users.doc(uid).get();

    if (documentSnapshot.exists) {
      Map<String, dynamic>? data =
          documentSnapshot.data() as Map<String, dynamic>?;
      if (data != null && data.containsKey('theme')) {
        return data['theme'] ?? 'Default';
      }
    }
    return 'Default';
  }

  Future<String> getUserLang(String uid) async {
    CollectionReference users = FirebaseFirestore.instance.collection('users');
    DocumentSnapshot documentSnapshot = await users.doc(uid).get();

    if (documentSnapshot.exists) {
      Map<String, dynamic>? data =
          documentSnapshot.data() as Map<String, dynamic>?;
      if (data != null && data.containsKey('language')) {
        return data['language'] ?? 'Fr';
      }
    }
    return 'Default';
  }

  Future<int> getUserGamePlayed(String uid) async {
    CollectionReference users = FirebaseFirestore.instance.collection('users');
    DocumentSnapshot documentSnapshot = await users.doc(uid).get();
    return documentSnapshot['gamePlayed'];
  }

  Future<void> updateUserGamePlayer(String uid) async {
    int currentGamePlayed = await getUserGamePlayed(uid);
    CollectionReference users = db.collection('users');
    return users
        .doc(uid)
        .update({'gamePlayed': currentGamePlayed + 1}).catchError(
            (error) => print("Failed to update user: $error"));
  }

  Future<int> getUserGameWins(String uid) async {
    CollectionReference users = FirebaseFirestore.instance.collection('users');
    DocumentSnapshot documentSnapshot = await users.doc(uid).get();
    return documentSnapshot['gameWins'];
  }

  Future<void> updateUserGameWins(String uid) async {
    int currentGameWins = await getUserGameWins(uid);
    CollectionReference users = db.collection('users');
    return users.doc(uid).update({'gameWins': currentGameWins + 1}).catchError(
        (error) => print("Failed to update user: $error"));
  }

  Future<int> getUserNbDiffFound(String uid) async {
    CollectionReference users = FirebaseFirestore.instance.collection('users');
    DocumentSnapshot documentSnapshot = await users.doc(uid).get();
    return documentSnapshot['numberDifferenceFound'];
  }

  Future<void> updateUserNbDiffFound(String uid) async {
    int currentNbDifferenceFound = await getUserNbDiffFound(uid);
    CollectionReference users = db.collection('users');
    return users.doc(uid).update({
      'numberDifferenceFound': currentNbDifferenceFound + 1
    }).catchError((error) => print("Failed to update user: $error"));
  }

  Future<int> getUserTotalTimePlayed(String uid) async {
    CollectionReference users = FirebaseFirestore.instance.collection('users');
    DocumentSnapshot documentSnapshot = await users.doc(uid).get();
    return documentSnapshot['totalTimePlayed'];
  }

  Future<void> updateUserTotalTimePlayed(String uid, int timePlayed) async {
    print(timePlayed);
    int currentTotalTimePlayed = await getUserTotalTimePlayed(uid);
    CollectionReference users = db.collection('users');
    return users.doc(uid).update({
      'totalTimePlayed': currentTotalTimePlayed + timePlayed
    }).catchError((error) => print("Failed to update user: $error"));
  }

  Future<void> updateUserName(String uid, String newUserName) async {
    final bool isAvailable = await isUserNameAvailable(newUserName);
    if (isAvailable) {
      CollectionReference users = db.collection('users');
      await users.doc(uid).update({'displayName': newUserName}).catchError(
          (error) =>
              throw ("Erreur lors de la mise à jour du nom d'utilisateur"));
    } else {
      throw ('Le nom d\'utilisateur est déjà pris.');
    }
  }

  Future<String> initUser(UserData currentUser) async {
    if (currentUser.photoURL == '') {
      avatar = 'assets/default-user-icon.jpg';
    }
    if (currentUser.photoURL!.startsWith('assets/')) {
      avatar = currentUser.photoURL;
    } else {
      avatar = await getPhotoURL(currentUser.uid);
    }
    return avatar!;
  }
}
