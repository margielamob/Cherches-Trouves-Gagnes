import 'dart:convert';

import 'package:app/data/carrousel_request_data.dart';
import 'package:http/http.dart' as http;

class HttpService {
  final String baseUri = 'http://localhost:3000/api';

  Future<CarrouselRequestData> fetchCarrouselByPage(int page) async {
    final response =
        await http.get(Uri.parse('$baseUri/game/cards/?page=$page'));
    if (response.statusCode == 200) {
      final responseData = await jsonDecode(response.body);
      final responseApi = CarrouselRequestData.fromJson(responseData);
      return responseApi;
    } else {
      throw Exception('Failed to load cards');
    }
  }
}
