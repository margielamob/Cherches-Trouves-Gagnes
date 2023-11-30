import 'package:app/components/carousel_bottom.dart';
import 'package:app/components/carousel_modal.dart';
import 'package:app/domain/models/game_card_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class CarouselBottomDelete extends CarouselBottom {
  CarouselBottomDelete(GameCardModel data) : super(data: data);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(0.0, 8.0, 0.0, 0.0),
      child: Row(
        children: [
          FilledButton(
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return CarouselModal(
                      verification: AppLocalizations.of(context)!.deleteConfirm,
                      gameId: data.id);
                },
              );
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Text(AppLocalizations.of(context)!.deleteBoutton),
                Icon(Icons.delete),
              ],
            ),
          )
        ],
      ),
    );
  }
}
