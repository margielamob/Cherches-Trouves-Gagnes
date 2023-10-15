import 'package:app/services/user-service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:get_it/get_it.dart';

class AuthService {
  FirebaseAuth auth = FirebaseAuth.instance;
  UserService userService = GetIt.I.get<UserService>();

  Future<UserCredential> signIn(String email, String password) async {
    try {
      UserCredential userCredential = await auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      return userCredential;
    } on FirebaseAuthException {
      rethrow;
    }
  }

  Future<UserCredential> signUp(
      String email, String password, String displayName) async {
    UserCredential userCredential =
        await FirebaseAuth.instance.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );

    return userCredential;
  }

  Future<UserCredential> signInWithUserName(
      String credential, String password, bool isEmail) async {
    if (isEmail) {
      try {
        return await signIn(credential, password);
      } catch (error) {
        print(error);
        rethrow;
      }
    } else {
      try {
        final userSnapshot = await userService.getUserByDisplayName(credential);
        if (userSnapshot == null) {
          throw Exception('nom introuvable');
        }

        Map<String, dynamic>? userData =
            userSnapshot.data() as Map<String, dynamic>?;
        final userEmail = userData?['email'];
        if (userEmail != null) {
          return await signIn(userEmail, password);
        } else {
          throw Exception('adress-email introuvable');
        }
      } catch (error) {
        print(error);
        rethrow;
      }
    }
  }

  Future<void> signOut() async {
    await auth.signOut();
  }

  Future<String> getCurrentUserId() async {
    return auth.currentUser!.uid;
  }

  Future<UserData?> getCurrentUser() async {
      DocumentSnapshot userDoc = await userService.db.collection('users').doc(await getCurrentUserId()).get();
      if (userDoc.exists) {
        return UserData(
          uid: userDoc['uid'],
          displayName: userDoc['displayName'],
          email: userDoc['email'],
          photoURL: userDoc['photoURL'],
          phoneNumber: userDoc['phoneNumber'],
          theme: userDoc['theme'],
          language: userDoc['language'],
          gameLost: userDoc['gameLost'],
          gameWins: userDoc['gameWins'],
          gamePlayed: userDoc['gamePlayed'],
          averageTime: userDoc['averageTime'],
        );
      }
    return null;
  }

}
