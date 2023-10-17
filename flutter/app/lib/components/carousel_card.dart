import 'package:app/components/carousel_modal.dart';
import 'package:flutter/material.dart';
import 'package:app/domain/models/game_card_model.dart';

class CarouselCard extends StatelessWidget {
  final GameCardModel data;
  const CarouselCard({required this.data});

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
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: Colors.black,
                        width: 1.0,
                      ),
                    ),
                    child: SizedBox(
                      width: 320,
                      height: 240,
                      child: Image.memory(
                        data.thumbnail,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.fromLTRB(0.0, 8.0, 0.0, 0.0),
                    child: Row(
                      children: [
                        FilledButton(
                          onPressed: () {
                            showDialog(
                              context: context,
                              builder: (BuildContext context) {
                                return CarouselModal(
                                    verification:
                                        "Voulez-vous vraiment supprimer ce jeux?",
                                    gameId: data.id);
                              },
                            );
                          },
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              Text("Supprimer "),
                              Icon(Icons.delete),
                            ],
                          ),
                        )
                      ],
                    ),
                  )
                ],
              ),
            ),
          ),
        ])
      ],
    );
  }
}


/*
                            carouselService.deleteCardById(data.id);

*/