import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

class HttpClientService {
  final String baseUri = 'http://localhost:3000/api';

  Future<Map<dynamic, dynamic>> fetchRawCardsByPage(int page) async {
    final response =
        await http.get(Uri.parse('$baseUri/game/cards/?page=$page'));
    if (response.statusCode == HttpStatus.ok) {
      final responseData = await jsonDecode(response.body);
      responseData['carouselInfo']['hasNext'];
      final List<Map<dynamic, dynamic>> cardList =
          (responseData['games'] as List<dynamic>)
              .map<Map<dynamic, dynamic>>(
                  (jsonCard) => jsonCard as Map<dynamic, dynamic>)
              .toList();
      return {
        'list': cardList,
        'hasNext': responseData['carouselInfo']['hasNext'] as bool,
      };
    } else {
      throw Exception('Failed to load cards');
    }
  }

  Future<bool> deleteCardById(String id) async {
    try {
      final response = await http.delete(Uri.parse('$baseUri/game/cards/$id'));
      return response.statusCode == HttpStatus.accepted;
    } catch (error) {
      throw Exception('Could not communicate with server');
    }
  }

  Future<bool> deleteCardSelection(Set<String> ids) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUri/game/cards/selection'),
        body: jsonEncode(ids),
      );
      return response.statusCode == HttpStatus.accepted;
    } catch (error) {
      throw Exception('Could not communicate with server');
    }
  }
}
