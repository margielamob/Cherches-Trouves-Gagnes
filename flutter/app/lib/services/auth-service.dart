import 'package:app/services/user-service.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:get/get.dart';

class AuthService {
  FirebaseAuth auth = FirebaseAuth.instance;
  UserService userService = Get.find();

  Future<UserCredential> signIn(String email, String password) async {
    try {
      UserCredential userCredential =
          await FirebaseAuth.instance.signInWithEmailAndPassword(
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
}
