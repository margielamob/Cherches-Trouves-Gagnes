import 'package:app/domain/models/user_data.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:app/domain/services/profile_page_manager.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:get/get.dart';
import 'package:rxdart/rxdart.dart';

class AuthService {
  PersonalUserService userService = Get.find();
  // ChatManagerService chatService = Get.find();
  FirebaseAuth auth = FirebaseAuth.instance;
  UserData? currentUser;

  BehaviorSubject<UserData?> userSubject = BehaviorSubject<UserData?>();

  Future<UserCredential> signIn(String email, String password) async {
    try {
      UserCredential userCredential =
          await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      currentUser = await getCurrentUser();
      userSubject.add(currentUser);
      // chatService.initChat();
      final profilePageManager = Get.find<ProfilePageManager>();
      await profilePageManager.initUserThemeAndLang();

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

      // cast the error to a firebase auth exception

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
        rethrow;
      }
    } else {
      try {
        final userSnapshot = await userService.getUserByDisplayName(credential);
        if (userSnapshot == null) {
          throw ('Nom d\'utilisateur introuvable');
        }

        Map<String, dynamic>? userData =
            userSnapshot.data() as Map<String, dynamic>?;
        final userEmail = userData?['email'];
        if (userEmail != null) {
          return await signIn(userEmail, password);
        } else {
          throw ('Nom d\'utilisateur introuvable');
        }
      } catch (error) {
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
        gameWins: userDoc['gameWins'],
        numberDifferenceFound: userDoc['numberDifferenceFound'],
        totalTimePlayed: userDoc['totalTimePlayed'],
        gamePlayed: userDoc['gamePlayed'],
      );
    }
    return null;
  }

  Future<void> resetPassword(String email) async {
    try {
      await auth.sendPasswordResetEmail(email: email);
    } on FirebaseAuthException catch (error) {
      String errorMessage;

      switch (error.code) {
        case 'invalid-email':
          errorMessage = 'Adresse e-mail invalide.';
          break;
        case 'user-not-found':
          errorMessage = 'Aucun utilisateur trouvé avec cet e-mail.';
          break;
        default:
          errorMessage =
              'Une erreur s’est produite. Veuillez réessayer plus tard.';
      }

      throw errorMessage;
    }
  }
}
