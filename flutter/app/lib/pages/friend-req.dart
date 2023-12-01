import 'package:app/domain/models/user_data.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/friends_service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class FriendRequestsPage extends StatefulWidget {
  @override
  _FriendRequestsPageState createState() => _FriendRequestsPageState();
}

class _FriendRequestsPageState extends State<FriendRequestsPage> {
  final FirebaseFirestore firestore = FirebaseFirestore.instance;
  final AuthService authService = Get.find();
  final FriendRequestService friendRequestService = Get.find();
  String currentUserUid = ''; // Remplacez par l'UID de l'utilisateur actuel

  @override
  void initState() {
    super.initState();
    _initializeCurrentUser();
  }

  Future<void> _initializeCurrentUser() async {
    currentUserUid = await authService.getCurrentUserId();
    setState(
        () {}); // Met à jour l'interface utilisateur après avoir récupéré l'UID
  }

  Future<String> _getUserName(String userId) async {
    DocumentSnapshot userDoc =
        await firestore.collection('users').doc(userId).get();
    if (userDoc.exists) {
      UserData user = UserData.fromSnapshot(userDoc);
      return user.displayName;
    }
    return 'Utilisateur inconnu';
  }

  void _acceptRequest(FriendRequest request) async {
    try {
      await friendRequestService.acceptRequest(request);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Demande acceptée')));
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur lors de l\'acceptation')));
    }
  }

  void _rejectRequest(FriendRequest request) async {
    try {
      await friendRequestService.declineRequest(request);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Demande rejetée')));
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Erreur lors du rejet')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Demandes d\'amis'),
      ),
      body: StreamBuilder<List<FriendRequest>>(
        stream: friendRequestService
            .listenForReceivedFriendRequests(currentUserUid),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError || !snapshot.hasData) {
            return Center(child: Text('Erreur ou aucune donnée'));
          }

          return ListView.builder(
            itemCount: snapshot.data!.length,
            itemBuilder: (context, index) {
              FriendRequest request = snapshot.data![index];
              return FutureBuilder<String>(
                future: _getUserName(request.from),
                builder: (context, userSnapshot) {
                  if (userSnapshot.connectionState == ConnectionState.waiting) {
                    return ListTile(title: Text('Chargement...'));
                  }
                  return ListTile(
                    title: Text('Demande de : ${userSnapshot.data}'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: Icon(Icons.check, color: Colors.green),
                          onPressed: () => _acceptRequest(request),
                        ),
                        IconButton(
                          icon: Icon(Icons.close, color: Colors.red),
                          onPressed: () => _rejectRequest(request),
                        ),
                      ],
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
