import 'package:app/components/accept_player_modal.dart';
import 'package:app/components/carousel.dart';
import 'package:app/domain/services/app_bar_service.dart';
import 'package:app/domain/services/carousel_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class GameSelectionPage extends StatelessWidget {
  final CarouselService service = Get.find();
  final GameManagerService gameManagerService = Get.find();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBarService.buildBar(
        context,
        'Page de sélection de vignettes',
      ),
      body: Column(
        children: [
          SizedBox(height: 30),
          Expanded(
            child: Carousel(isCarouselForAdminPage: false),
          ),
          FilledButton(
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AcceptPlayerModal();
                },
              );
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Text("call Modal "),
                Icon(Icons.delete),
              ],
            ),
          )
        ],
      ),
    );
  }
}

/*

          if (gameManagerService.isModalShown) {
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

*/
