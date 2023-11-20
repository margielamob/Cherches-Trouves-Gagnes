import 'package:app/components/carousel.dart';
import 'package:app/components/carousel_modal.dart';
import 'package:app/components/custom_app_bar.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:app/pages/create_game_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class AdminPage extends StatelessWidget {
  final CarouselService service = Get.find();
  @override
  Widget build(BuildContext context) {
    final carouselService = Provider.of<CarouselService>(context);

    return Scaffold(
      appBar: CustomAppBar.buildLogoutOnly(context, 'Administration'),
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.all(20.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                FilledButton(
                  onPressed: () {
                    Get.to(CreateGamePage());
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text("Créer un jeux"),
                      SizedBox(width: 2.0),
                      Icon(Icons.create),
                    ],
                  ),
                ),
                SizedBox(width: 10.0),
                FilledButton(
                  onPressed: carouselService.areGamesAvailable()
                      ? () {
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return CarouselModal(
                                verification:
                                    "Voulez-vous vraiment supprimer tous les jeux?",
                                isAllGames: true,
                              );
                            },
                          );
                        }
                      : null,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text("Supprimer tous les jeux"),
                      SizedBox(width: 2.0),
                      Icon(Icons.delete),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: Carousel(isCarouselForAdminPage: true),
          ),
        ],
      ),
    );
  }
}
