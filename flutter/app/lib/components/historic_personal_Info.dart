import 'package:app/domain/models/user_data.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class HistoricPersonalInfo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        HistoricConnection(),
        SizedBox(width: 50),
      ],
    );
  }
}

class HistoricConnection extends StatefulWidget {
  HistoricConnection({Key? key}) : super(key: key);
  @override
  State<HistoricConnection> createState() => HistoricConnectionState();
}

class HistoricConnectionState extends State<HistoricConnection> {
  final PersonalUserService userService = Get.find();
  final AuthService authService = Get.find();
  UserData? currentUser;
  List<List<Timestamp>>? listLog;
  List<GameHistoric>? listGamesHistoric;

  Future<List<List<Timestamp>>?> initUserHistoric() async {
    currentUser = await authService.getCurrentUser();
    if (currentUser != null) {
      listLog = await userService.getLog(currentUser!.uid);
      listGamesHistoric =
          await userService.getUserGamesHistoric(currentUser!.uid);
      return listLog;
    } else {
      listGamesHistoric = [];
      return listLog = [];
    }
  }

  @override
  void initState() {
    super.initState();
    initUserHistoric();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<List<Timestamp>>?>(
      future: initUserHistoric(),
      builder: (BuildContext context,
          AsyncSnapshot<List<List<Timestamp>>?> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(
            child: CircularProgressIndicator(),
          );
        } else if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        } else if (!snapshot.hasData) {
          return Text('No data available');
        } else {
          if (snapshot.data!.isEmpty) {
            return Center(
              child: Column(
                children: [
                  SizedBox(height: 30),
                  Text("Il n'y a pas d'historique pour le moment!")
                ],
              ),
            );
          } else {
            return Center(
              child: Row(
                children: [
                  SizedBox(
                    width: 400,
                    height: 400,
                    child: Card(
                      // Use a Card widget for the box appearance
                      elevation: 5,
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Text("Historique des connexions",
                                style: TextStyle(fontSize: 20)),
                            SizedBox(height: 10),
                            Expanded(
                              child: SingleChildScrollView(
                                child: ConstrainedBox(
                                  constraints: BoxConstraints(
                                    maxHeight: 400,
                                  ),
                                  child: ListView.builder(
                                    scrollDirection: Axis.vertical,
                                    shrinkWrap: true,
                                    itemCount: listLog![0].length,
                                    itemBuilder: (context, index) {
                                      return Text(
                                          '${listLog![0][index].toDate()}');
                                    },
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 50),
                  SizedBox(
                    width: 400,
                    height: 400,
                    child: Card(
                      elevation: 5,
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Text("Historique des déconnexions",
                                style: TextStyle(fontSize: 20)),
                            SizedBox(height: 10),
                            Expanded(
                              child: SingleChildScrollView(
                                child: ConstrainedBox(
                                  constraints: BoxConstraints(
                                    maxHeight: 400,
                                  ),
                                  child: ListView.builder(
                                    scrollDirection: Axis.vertical,
                                    shrinkWrap: true,
                                    itemCount: listLog![1].length,
                                    itemBuilder: (context, index) {
                                      return Text(
                                          '${listLog![1][index].toDate()}');
                                    },
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 50),
                  SizedBox(
                    width: 400,
                    height: 400,
                    child: Card(
                      elevation: 5,
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Text("Historique des parties",
                                style: TextStyle(fontSize: 20)),
                            SizedBox(height: 10),
                            Expanded(
                              child: SingleChildScrollView(
                                child: ConstrainedBox(
                                  constraints: BoxConstraints(
                                    maxHeight: 400,
                                  ),
                                  child: ListView.builder(
                                    scrollDirection: Axis.vertical,
                                    shrinkWrap: true,
                                    itemCount: listGamesHistoric!.length,
                                    itemBuilder: (context, index) {
                                      bool isGameWin =
                                          listGamesHistoric![index].isGameWin;
                                      return Row(
                                        children: [
                                          Text(
                                              '${listGamesHistoric![index].timestamp.toDate()}'),
                                          SizedBox(width: 10),
                                          isGameWin
                                              ? Icon(
                                                  Icons.check_circle,
                                                  color: Colors.green,
                                                )
                                              : Icon(
                                                  Icons.cancel,
                                                  color: Colors.red,
                                                ),
                                        ],
                                      );
                                    },
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          }
        }
      },
    );
  }
}