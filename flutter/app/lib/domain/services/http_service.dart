import 'package:app/domain/models/game_image_model.dart';
import 'package:app/domain/models/carousel_request_model.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';

class HttpService {
  final String baseUri = 'http://localhost:3000/api';

  Future<CarouselRequestModel> fetchCarouselByPage(int page) async {
    final response =
        await http.get(Uri.parse('$baseUri/game/cards/?page=$page'));
    if (response.statusCode == 200) {
      final responseData = await jsonDecode(response.body);
      final responseApi = CarouselRequestModel.fromJson(responseData);
      return responseApi;
    } else {
      throw Exception('Failed to load cards');
    }
  }

  Future<GameImageModel> fetchGameImage(String bmpId) async {
    final response = await http.get(Uri.parse('$baseUri/bmp/$bmpId'));
    if (response.statusCode == 200) {
      final responseData = await jsonDecode(response.body);
      final requestParsed = GameImageModel.fromJson(responseData);
      return requestParsed;
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

  Future<bool> deleteAllCards() async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUri/game/cards'),
      );
      return response.statusCode == HttpStatus.accepted;
    } catch (error) {
      throw Exception('Could not communicate with server');
    }
  }
}
