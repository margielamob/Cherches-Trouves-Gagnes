import 'package:app/domain/models/user_data.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class UsernameDialog extends StatelessWidget {
  final TextEditingController usernameController = TextEditingController();
  final PersonalUserService userService = PersonalUserService();
  final _formKey = GlobalKey<FormState>();
  final String userId;

  final ChatManagerService chatManagerService = Get.find();
  final AuthService authService = Get.find();

  UsernameDialog({required this.userId});

  void _saveNewUsername(BuildContext context) async {
    if (_formKey.currentState!.validate()) {
      String newUsername = usernameController.text.trim();
      try {
        String oldName = authService.currentUser!.displayName;
        await userService.updateUserName(userId, newUsername);
        print('oldName: $oldName');
        chatManagerService.updateMessagesUsername(oldName, newUsername);
        authService.userSubject.add(UserData(
            uid: authService.currentUser!.uid,
            displayName: newUsername,
            email: authService.currentUser!.email,
            photoURL: authService.currentUser!.photoURL));
        Navigator.of(context).pop();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(e.toString()),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Change Username'),
      content: Form(
        key: _formKey,
        child: TextFormField(
          controller: usernameController,
          decoration: InputDecoration(
            labelText: 'Nouveau nom d\'utilisateur',
            hintText: 'Enter le nouveau nom d\'utilisateur',
          ),
          validator: (value) {
            // Ajoutez votre logique de validation ici
            if (value == null || value.isEmpty) {
              return "Veuillez entrer un nom d'utilisateur.";
            }
            if (value.contains('@') || value.contains(' ')) {
              return "Le nom d'utilisateur ne doit pas contenir d'espaces ou le caractére @.";
            }
            return null;
          },
        ),
      ),
      actions: <Widget>[
        TextButton(
          child: Text('Cancel'),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        TextButton(
          child: Text('Save'),
          onPressed: () {
            _saveNewUsername(context);
          },
        ),
      ],
    );
  }
}
