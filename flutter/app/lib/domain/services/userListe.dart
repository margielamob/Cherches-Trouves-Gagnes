import 'package:app/domain/models/user_data.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/friends_service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class AllUsersPage extends StatefulWidget {
  @override
  AllUsersPageState createState() => AllUsersPageState();
}

class AllUsersPageState extends State<AllUsersPage> {
  final FirebaseFirestore firestore = FirebaseFirestore.instance;
  final TextEditingController _searchController = TextEditingController();
  final AuthService authService = Get.find();
  final FriendRequestService friendRequestService = Get.find();
  String currentUserUid = '';
  List<String> currentUserFriends = [];

  @override
  void initState() {
    super.initState();
    _initializeCurrentUser();
  }

  Future<void> _initializeCurrentUser() async {
    currentUserUid = await authService.getCurrentUserId();
    _fetchCurrentUserFriends();
  }

  void _fetchCurrentUserFriends() async {
    DocumentSnapshot userDoc =
        await firestore.collection('users').doc(currentUserUid).get();
    if (userDoc.exists) {
      UserData currentUser = UserData.fromSnapshot(userDoc);
      setState(() {
        currentUserFriends = currentUser.friends ?? [];
      });
    }
  }

  void _sendFriendRequest(String toUserId) async {
    try {
      await friendRequestService.sendFriendRequest(currentUserUid, toUserId);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Demande d\'ami envoyée')));
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur lors de l\'envoi de la demande')));
    }
  }

  void _cancelFriendRequest(String toUserId) async {
    try {
      await friendRequestService.cancelFriendRequest(currentUserUid, toUserId);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Demande d\'ami annulée')));
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Erreur lors de l\'annulation de la demande')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Tous les Utilisateurs'),
      ),
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.all(8.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                labelText: 'Chercher un utilisateur',
                suffixIcon: Icon(Icons.search),
              ),
              onChanged: (value) => setState(() {}),
            ),
          ),
          Expanded(
            child: StreamBuilder<List<FriendRequest>>(
              stream: friendRequestService
                  .getSentFriendRequestUpdates(currentUserUid),
              builder: (context, requestsSnapshot) {
                if (requestsSnapshot.connectionState ==
                    ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                }

                var sentRequests = requestsSnapshot.data ?? [];

                return StreamBuilder<QuerySnapshot>(
                  stream: firestore.collection('users').snapshots(),
                  builder: (context, usersSnapshot) {
                    if (usersSnapshot.connectionState ==
                        ConnectionState.waiting) {
                      return Center(child: CircularProgressIndicator());
                    }

                    if (usersSnapshot.hasError) {
                      return Text('Erreur : ${usersSnapshot.error}');
                    }

                    var filteredUsers = usersSnapshot.data!.docs
                        .map((doc) => UserData.fromSnapshot(doc))
                        .where((user) => user.displayName
                            .toLowerCase()
                            .contains(_searchController.text.toLowerCase()))
                        .toList();

                    return ListView.builder(
                      itemCount: filteredUsers.length,
                      itemBuilder: (context, index) {
                        UserData user = filteredUsers[index];
                        if (user.uid == currentUserUid) return Container();

                        bool requestSent = sentRequests
                            .any((request) => request.to == user.uid);
                        bool isAlreadyFriend =
                            currentUserFriends.contains(user.uid);

                        return Container(
                          margin: EdgeInsets.all(10),
                          padding: EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.grey[200],
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Text(user.displayName,
                                  style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold)),
                              isAlreadyFriend
                                  ? Text('Ami(e)',
                                      style: TextStyle(color: Colors.green))
                                  : ElevatedButton(
                                      onPressed: () => requestSent
                                          ? _cancelFriendRequest(user.uid)
                                          : _sendFriendRequest(user.uid),
                                      child: Text(
                                          requestSent ? 'Annuler' : 'Ajouter'),
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
          ),
        ],
      ),
    );
  }
}
