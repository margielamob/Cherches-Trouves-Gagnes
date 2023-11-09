import 'package:app/domain/models/user_model.dart';

class CreatorLeftRequest {
  UserModel? creator;

  CreatorLeftRequest({this.creator});

  factory CreatorLeftRequest.fromJson(Map<String, dynamic> json) {
    final creator = json['player'];

    return CreatorLeftRequest(
      creator:
          creator.map((playerInfo) => UserModel.fromMap(playerInfo)).toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user': {
        'id': creator?.id,
        'name': creator?.name,
        'avatar': creator?.avatar,
      },
    };
  }
}
