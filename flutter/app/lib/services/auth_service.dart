import 'package:app/services/user_service.dart';
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
}
