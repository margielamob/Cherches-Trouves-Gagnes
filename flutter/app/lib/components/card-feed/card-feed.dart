import 'package:app/components/game-card/admin-card-data.dart';
import 'package:app/components/game-card/admin-card-widget.dart';
import 'package:app/events/card-deleted-event.dart';
import 'package:app/services/card-feed-service.dart';
import 'package:app/services/card-service.dart';
import 'package:event_bus/event_bus.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';

class CardFeed extends StatefulWidget {
  const CardFeed({super.key});

  @override
  State<CardFeed> createState() => _CardFeedState();
}

class _CardFeedState extends State<CardFeed> {
  final _feedService = GetIt.I.get<CardFeedService>();
  final _eventBus = GetIt.I.get<EventBus>();
  final _scrollController = ScrollController();
  final _cardService = GetIt.I.get<CardService>();

  List<AdminCardData> currentCards = [];
  bool _isUpdatingCards = false;

  final GlobalKey<RefreshIndicatorState> _refreshKey =
      GlobalKey<RefreshIndicatorState>();

  @override
  void initState() {
    super.initState();
    _fetchCards();
    _handleCardDeleted();
  }

  Future<void> _fetchCards() async {
    try {
      await _feedService.fetchCards();
      setState(() {
        currentCards.addAll(_feedService.getCurrentCards());
      });
    } catch (error) {
      print(error);
    }
  }

  Future<void> _handleRefresh() async {
    if (!_feedService.hasNext) {
      return;
    }

    setState(() {
      _isUpdatingCards = true;
    });

    await _fetchCards();
    setState(() {
      _isUpdatingCards = false;
    });
  }

  bool isLoading() {
    return _feedService.isFetching() || _isUpdatingCards;
  }

  @override
  void dispose() {
    super.dispose();
    _feedService.reset();
  }

  void _handleCardDeleted() {
    _eventBus.on<CardDeletedEvent>().listen((event) {
      setState(() {
        currentCards.removeWhere((element) => element.id == event.cardId);
      });
    });
  }

  AlertDialog buildDialog(context) {
    return AlertDialog(
      title: Text("Confirmation de suppression"),
      content: Text("Êtes vous sur de supprimer tous les jeux?"),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: Text("Annuler"),
        ),
        TextButton(
          onPressed: () {
            _cardService.deleteAll().then((deleted) {
              if (deleted) {
                setState(() {
                  currentCards.clear();
                });
              }
            });
            Navigator.of(context).pop();
          },
          child: Text("Confirmer"),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return isLoading()
        ? Center(
            child: CircularProgressIndicator(),
          )
        : Column(
            children: [
              Expanded(
                child: RefreshIndicator(
                  key: _refreshKey,
                  onRefresh: _handleRefresh,
                  child: GridView.builder(
                    controller: _scrollController,
                    cacheExtent: 500,
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 8.0,
                      mainAxisSpacing: 8.0,
                    ),
                    itemCount: currentCards.length,
                    itemBuilder: (context, index) {
                      return AdminCardWidget(data: currentCards[index]);
                    },
                  ),
                ),
              ),
              Container(
                decoration: BoxDecoration(
                  color: Colors.deepPurple.withOpacity(
                      0.3), // Set the background colorApply rounded corners
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Spacer(),
                    Padding(
                      padding: EdgeInsets.all(10.0),
                      child: ElevatedButton.icon(
                        onPressed: () {
                          _handleRefresh();
                        },
                        icon: Icon(
                          Icons.refresh,
                          color:
                              _feedService.hasNext ? Colors.white : Colors.grey,
                        ),
                        label: Text('Charger plus de jeux'),
                      ),
                    ),
                    Spacer(),
                    Padding(
                      padding: EdgeInsets.all(10.0),
                      child: ElevatedButton.icon(
                        onPressed: () {
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return buildDialog(context);
                            },
                          );
                        },
                        icon: Icon(Icons.delete),
                        label: Text('Supprimer tout'),
                      ),
                    ),
                    Spacer(),
                  ],
                ),
              )
            ],
          );
  }
}
