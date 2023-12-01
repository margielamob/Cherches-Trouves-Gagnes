import 'package:app/domain/models/user_data.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:get/get.dart';

class FriendRequestService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final AuthService authService = Get.find();

  Future<void> sendFriendRequest(String fromUserId, String toUserId) async {
    var sortedIds = [fromUserId, toUserId]..sort();
    var uniqueKey = sortedIds.join('_');

    var friendRequest = {
      'from': fromUserId,
      'to': toUserId,
      'uniqueKey': uniqueKey,
    };

    await _firestore.collection('friendRequests').add(friendRequest);
  }

  Future<void> cancelFriendRequest(String fromUserId, String toUserId) async {
    var sortedIds = [fromUserId, toUserId]..sort();
    var uniqueKey = sortedIds.join('_');

    var querySnapshot = await _firestore
        .collection('friendRequests')
        .where('uniqueKey', isEqualTo: uniqueKey)
        .get();

    if (querySnapshot.docs.isNotEmpty) {
      await querySnapshot.docs.first.reference.delete();
    } else {
      throw Exception('Demande d’ami non trouvée');
    }
  }

  Stream<UserData?> getUserData(String userId) {
    return _firestore
        .collection('users')
        .doc(userId)
        .snapshots()
        .map((doc) => UserData.fromSnapshot(doc));
  }

  Stream<List<FriendRequest>> getSentFriendRequestUpdates(String userId) {
    return _firestore
        .collection('friendRequests')
        .where('from', isEqualTo: userId)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => FriendRequest.fromSnapshot(doc))
            .toList());
  }

  Stream<List<FriendRequest>> listenForReceivedFriendRequests(String userId) {
    return _firestore
        .collection('friendRequests')
        .where('to', isEqualTo: userId)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => FriendRequest.fromSnapshot(doc))
            .toList());
  }

  Future<void> updateFriendRequestStatus(
      String requesterUid, String currentUserUid, String status) async {
    var querySnapshot = await _firestore
        .collection('friendRequests')
        .where('from', isEqualTo: requesterUid)
        .where('to', isEqualTo: currentUserUid)
        .get();

    var batch = _firestore.batch();
    for (var doc in querySnapshot.docs) {
      batch.update(doc.reference, {'status': status});
    }
    await batch.commit();
  }

  Future<void> addToFriendsList(
      String currentUserUid, String requesterUid) async {
    var currentUserDocRef = _firestore.doc('users/$currentUserUid');
    var requesterUserDocRef = _firestore.doc('users/$requesterUid');

    var currentUserSnapshot = await currentUserDocRef.get();
    var requesterUserSnapshot = await requesterUserDocRef.get();

    var updatedCurrentUserFriendsList =
        List<String>.from(currentUserSnapshot.data()?['friends'] ?? []);
    if (!updatedCurrentUserFriendsList.contains(requesterUid)) {
      updatedCurrentUserFriendsList.add(requesterUid);
    }

    var updatedRequesterFriendsList =
        List<String>.from(requesterUserSnapshot.data()?['friends'] ?? []);
    if (!updatedRequesterFriendsList.contains(currentUserUid)) {
      updatedRequesterFriendsList.add(currentUserUid);
    }

    await currentUserDocRef.update({'friends': updatedCurrentUserFriendsList});
    await requesterUserDocRef.update({'friends': updatedRequesterFriendsList});
  }

  Future<void> deleteFriend(String currentUserUid, String friendUid) async {
    var currentUserDocRef = _firestore.doc('users/$currentUserUid');
    var friendDocRef = _firestore.doc('users/$friendUid');

    var currentUserSnapshot = await currentUserDocRef.get();
    var friendUserSnapshot = await friendDocRef.get();

    var updatedCurrentUserFriendsList =
        List<String>.from(currentUserSnapshot.data()?['friends'] ?? []);
    updatedCurrentUserFriendsList.remove(friendUid);

    var updatedFriendFriendsList =
        List<String>.from(friendUserSnapshot.data()?['friends'] ?? []);
    updatedFriendFriendsList.remove(currentUserUid);

    await Future.wait([
      currentUserDocRef.update({'friends': updatedCurrentUserFriendsList}),
      friendDocRef.update({'friends': updatedFriendFriendsList}),
    ]);
  }

  Stream<List<UserData>> searchUsers(String searchTerm) {
    return _firestore
        .collection('users')
        .snapshots()
        .map((snapshot) {
      var users =
          snapshot.docs.map((doc) => UserData.fromSnapshot(doc)).toList();
      print("Utilisateurs trouvés : ${users.length}"); 
      return users;
    });
  }

  Future<void> declineRequest(FriendRequest request) async {
    try {
      await cancelFriendRequest(request.from, request.to);
    } catch (error) {
      print('Erreur lors de l\'annulation de la demande d\'ami : $error');
    }
  }

  Future<void> acceptRequest(FriendRequest request) async {
    final currentUserUid = await authService.getCurrentUserId();

    try {
      await addToFriendsList(currentUserUid, request.from);
      await cancelFriendRequest(request.from, request.to);
    } catch (error) {
      print('Erreur lors de l\'acceptation de la demande d\'ami : $error');
    }
  }
}

class FriendRequest {
  final String from;
  final String to;

  FriendRequest({
    required this.from,
    required this.to,
  });

  factory FriendRequest.fromSnapshot(QueryDocumentSnapshot doc) {
    var data = doc.data() as Map<String, dynamic>;
    return FriendRequest(
      from: data['from'] as String,
      to: data['to'] as String,
    );
  }
}
