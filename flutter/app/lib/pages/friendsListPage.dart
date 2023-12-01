import 'package:app/domain/models/user_data.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/friends_service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class FriendsListPage extends StatefulWidget {
  @override
  _FriendsListPageState createState() => _FriendsListPageState();
}

class _FriendsListPageState extends State<FriendsListPage> {
  final FirebaseFirestore firestore = FirebaseFirestore.instance;
  final AuthService authService = Get.find();
  final FriendRequestService friendRequestService = Get.find();
  String currentUserUid = '';

  @override
  void initState() {
    super.initState();
    _initializeCurrentUser();
  }

  Future<void> _initializeCurrentUser() async {
    currentUserUid = await authService.getCurrentUserId();
    setState(() {});
  }

  Future<void> _removeFriend(String friendUid) async {
    try {
      await friendRequestService.deleteFriend(currentUserUid, friendUid);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Ami supprimé')));
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur lors de la suppression')));
    }
  }

  Future<String> _getFriendName(String friendUid) async {
    try {
      DocumentSnapshot friendDoc =
          await firestore.collection('users').doc(friendUid).get();
      if (friendDoc.exists) {
        UserData friend = UserData.fromSnapshot(friendDoc);
        return friend.displayName;
      }
      return 'Utilisateur inconnu';
    } catch (e) {
      return 'Erreur de chargement';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Liste d\'amis'),
      ),
      body: StreamBuilder<DocumentSnapshot>(
        stream: firestore.collection('users').doc(currentUserUid).snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError || !snapshot.hasData) {
            return Center(child: Text('Erreur ou aucune donnée'));
          }

          UserData currentUser = UserData.fromSnapshot(snapshot.data!);
          List<String> friendsList = currentUser.friends ?? [];

          if (friendsList.isEmpty) {
            return Center(child: Text('Aucun ami'));
          }

          return ListView.builder(
            itemCount: friendsList.length,
            itemBuilder: (context, index) {
              String friendUid = friendsList[index];
              return FutureBuilder<String>(
                future: _getFriendName(friendUid),
                builder: (context, friendSnapshot) {
                  if (friendSnapshot.connectionState ==
                      ConnectionState.waiting) {
                    return ListTile(title: Text('Chargement...'));
                  }
                  return ListTile(
                    title: Text(friendSnapshot.data ?? 'Utilisateur inconnu'),
                    trailing: IconButton(
                      icon: Icon(Icons.delete, color: Colors.red),
                      onPressed: () => _removeFriend(friendUid),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}
