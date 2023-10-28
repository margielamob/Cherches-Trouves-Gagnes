import 'dart:io';

import 'package:app/domain/models/user_data.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
// interface user

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

  Future<void> uploadAvatar(String uid, String imagePath) async {
    Reference ref = storage.ref().child('avatars/$uid/avatar.jpg');
    UploadTask uploadTask = ref.putFile(imagePath as File);
    await uploadTask.whenComplete(() => null);
    updateUserAvatar(uid, 'avatars/$uid/avatar.jpg');
  }
}
