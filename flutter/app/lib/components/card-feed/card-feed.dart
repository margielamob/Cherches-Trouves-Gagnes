import 'package:app/components/game-card/admin-card-data.dart';
import 'package:app/components/game-card/admin-card-widget.dart';
import 'package:app/services/card-feed-service.dart';
import 'package:flutter/material.dart';
import 'package:vibration/vibration.dart';
import 'package:get/get.dart';

class CardFeed extends StatefulWidget {
  const CardFeed({super.key});

  @override
  State<CardFeed> createState() => _CardFeedState();
}

class _CardFeedState extends State<CardFeed> {
  final CardFeedService feedService = Get.find();
  List<AdminCardData> currentCards = [];
  bool _isUpdatingCards = false;

  final GlobalKey<RefreshIndicatorState> _refreshKey =
      GlobalKey<RefreshIndicatorState>();

  @override
  void initState() {
    super.initState();
    _fetchCards();
  }

  Future<void> _fetchCards() async {
    try {
      await feedService.fetchCards();
      setState(() {
        currentCards.addAll(feedService.getCurrentCards());
      });
    } catch (error) {
      print(error);
    }
  }

  // Handle pull-to-refresh
  Future<void> _handleRefresh() async {
    Vibration.vibrate(duration: 50);

    setState(() {
      _isUpdatingCards = true;
    });

    await _fetchCards();

    setState(() {
      _isUpdatingCards = false;
    });
  }

  bool isLoading() {
    return feedService.isFetching() || _isUpdatingCards;
  }

  @override
  Widget build(BuildContext context) {
    return feedService.isFetching()
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
              GestureDetector(
                child: Center(
                  child: Icon(
                    Icons.keyboard_arrow_down,
                    size: 48,
                    color: Colors.deepPurple.withOpacity(0.8),
                  ),
                ),
                onTap: () {},
              )
            ],
          );
  }
}
