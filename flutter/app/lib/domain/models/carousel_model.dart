class CarouselModel {
  int currentPage;
  int gamesOnPage;
  int nbOfGames;
  int nbOfPages;
  bool hasNext;
  bool hasPrevious;

  CarouselModel({
    required this.currentPage,
    required this.gamesOnPage,
    required this.nbOfGames,
    required this.nbOfPages,
    required this.hasNext,
    required this.hasPrevious,
  });

  factory CarouselModel.fromJson(Map json) {
    return CarouselModel(
      currentPage: json['currentPage'],
      gamesOnPage: json['gamesOnPage'],
      nbOfGames: json['nbOfGames'],
      nbOfPages: json['nbOfPages'],
      hasNext: json['hasNext'],
      hasPrevious: json['hasPrevious'],
    );
  }
}

/*
"carouselInfo": {
    "currentPage": 1,
    "gamesOnPage": 4,
    "nbOfGames": 6,
    "nbOfPages": 2,
    "hasNext": true,
    "hasPrevious": false
*/