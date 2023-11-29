import 'package:app/components/carousel_bottom_classic.dart';
import 'package:app/components/carousel_bottom_delete.dart';
import 'package:app/components/image_border.dart';
import 'package:app/domain/models/game_card_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class CarouselCard extends StatelessWidget {
  final GameCardModel data;
  final bool isAdministrationPage;
  const CarouselCard({required this.data, required this.isAdministrationPage});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Card(
            shadowColor: Color.fromARGB(255, 46, 46, 46),
            margin: EdgeInsets.all(8.0),
            child: Padding(
              padding: EdgeInsets.all(8.0),
              child: Column(
                children: [
                  Text(
                    data.title,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 10),
                  ImageBorder.forSizeBox(
                    color: Colors.black,
                    width: 1.0,
                    sizeBoxChild: SizedBox(
                      width: 320,
                      height: 240,
                      child: Image.memory(
                        data.thumbnail,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  SizedBox(height: 10),
                  Text(
                    "${AppLocalizations.of(context)!.diffNumber} : ${data.nbDifferences}",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  isAdministrationPage
                      ? CarouselBottomDelete(data)
                      : CarouselBottomClassic(data),
                ],
              ),
            ),
          ),
        ])
      ],
    );
  }
}
