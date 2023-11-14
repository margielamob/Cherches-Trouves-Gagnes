lass AccountSettings extends StatelessWidget {
  final UserData currentUserData;

  AccountSettings({required this.currentUserData});

  void _changeTheme(BuildContext context, String? newTheme) {
    // Logique pour changer le thème de l'utilisateur
    // Implémentez la fonction de mise à jour Firestore ou l'appel à ProfilePageManager ici
  }

  void _changeLanguage(BuildContext context, String? newLanguage) {
    // Logique pour changer la langue de l'utilisateur
    // Implémentez la fonction de mise à jour Firestore ou l'appel à ProfilePageManager ici
  }

  @override
  Widget build(BuildContext context) {
    return CardWrapper(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SizedBox(height: 10),
          Text(
            "Paramètres du compte",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
          ),
          SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text('Nom d\'utilisateur'),
              Text(currentUserData.displayName,
                  style: TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
          SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text('Thème'),
              DropdownButton<String>(
                value: currentUserData.theme,
                onChanged: (newValue) {
                  _changeTheme(context, newValue);
                },
                items: <String>['Default', 'Alternative']
                    .map<DropdownMenuItem<String>>((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
              ),
            ],
          ),
          SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text('Langue'),
              DropdownButton<String>(
                value: currentUserData.language,
                onChanged: (newValue) {
                  _changeLanguage(context, newValue);
                },
                items: <String>['En', 'Fr']
                    .map<DropdownMenuItem<String>>((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
              ),
            ],
          ),
        ],
      ),
    );
  }
}