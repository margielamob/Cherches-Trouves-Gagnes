import 'package:app/domain/services/user_service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:get/get.dart';

class AuthService {
  UserService userService = Get.find();
  FirebaseAuth auth = FirebaseAuth.instance;

  Future<UserCredential> signIn(String email, String password) async {
    try {
      UserCredential userCredential = await auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      return userCredential;
    } on FirebaseAuthException catch (error) {
      String errorMessage;

      switch (error.code) {
        case 'user-not-found':
          errorMessage = 'Aucun utilisateur trouvé avec cet e-mail.';
          break;
        case 'wrong-password':
          errorMessage = 'Mot de passe incorrect.';
          break;
        case 'invalid-email':
          errorMessage = 'le format de l\'email est invalide';
          break;
        default:
          errorMessage =
              'Une erreur inconnue s’est produite. Veuillez réessayer plus tard.';
      }
      throw errorMessage;
    }
  }

  Future<UserCredential> signUp(
      String email, String password, String displayName) async {
    try {
      UserCredential userCredential =
          await FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      return userCredential;
    } on FirebaseAuthException catch (error) {
      String errorMessage;
      switch (error.code) {
        case 'email-already-in-use':
          errorMessage = 'Cet e-mail est déjà utilisé par un autre compte.';
          break;

        case 'invalid-email':
          errorMessage = 'Adresse e-mail invalide.';
          break;
        case 'weak-password':
          errorMessage =
              'Le mot de passe est trop faible. Veuillez choisir un mot de 6 caractères ou plus.';
          break;
        default:
          errorMessage =
              'Une erreur inconnue s’est produite. Veuillez réessayer plus tard.';
      }

      throw errorMessage;
    }
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
    DocumentSnapshot userDoc = await userService.db
        .collection('users')
        .doc(await getCurrentUserId())
        .get();
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
