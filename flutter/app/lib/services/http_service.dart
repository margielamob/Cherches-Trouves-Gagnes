import 'dart:convert';
import 'package:app/data/game_image_data.dart';
import 'package:http/http.dart' as http;

class HttpService {
  final String baseUri = 'http://localhost:3000/api';

  Future<List<Map<dynamic, dynamic>>> fetchRawCardsByPage(int page) async {
    final response =
        await http.get(Uri.parse('$baseUri/game/cards/?page=$page'));
    if (response.statusCode == 200) {
      final responseData = await jsonDecode(response.body);
      final List<Map<dynamic, dynamic>> cardList =
          (responseData['games'] as List<dynamic>)
              .map<Map<dynamic, dynamic>>(
                  (jsonCard) => jsonCard as Map<dynamic, dynamic>)
              .toList();
      return cardList;
    } else {
      throw Exception('Failed to load cards');
    }
  }

  Future<GameImage> fetchGameImage(String bmpId) async {
    final response = await http.get(Uri.parse('$baseUri/bmp/$bmpId'));
    if (response.statusCode == 200) {
      final responseData = await jsonDecode(response.body);
      return GameImage.fromJson(responseData);
    } else {
      throw Exception('Failed to load cards');
    }
  }
}