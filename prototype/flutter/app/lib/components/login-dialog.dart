import 'package:app/services/authentication.service.dart';
import 'package:flutter/material.dart';

class LoginDialog extends StatefulWidget {
  final AuthenticationService authenticationService;
  const LoginDialog({super.key, required this.authenticationService});
  @override
  // ignore: no_logic_in_create_state, library_private_types_in_public_api
  _LoginDialogState createState() =>
      // ignore: no_logic_in_create_state
      _LoginDialogState(authenticationService);
}

class _LoginDialogState extends State<LoginDialog> {
  final AuthenticationService _authenticationService;
  bool _canNavigate = false;
  bool _isLoading = false;
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _authenticationService.handleLogin(handleLogin);
  }

  void handleLogin(bool isLogged) {
    Future.delayed(Duration(seconds: 1), () {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _canNavigate = isLogged;
          navigate();
        });
      }
    });
  }

  void submitLogin() {
    if (mounted) {
      setState(() {
        _isLoading = true;
      });
      _authenticationService.alertLogin();
    }
  }

  void setLoginInfos() {
    if (mounted) {
      setState(() {
        _authenticationService.setLoginInfos(
            _usernameController.text, _passwordController.text);
      });
    }
  }

  void navigate() {
    if (_canNavigate) {
      Navigator.of(context).pop();
      Navigator.pushNamed(context, '/ChatMessagePage');
    } else {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('Login Error'),
            content: Text(
                'Username already exists or is not logged out. Please try again.'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: Text('OK'),
              ),
            ],
          );
        },
      );
    }
  }

  _LoginDialogState(this._authenticationService);
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
        title: Text('Login'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            TextFormField(
              controller: _usernameController,
              decoration: InputDecoration(
                labelText: 'Username',
              ),
            ),
            TextFormField(
              controller: _passwordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Password',
              ),
            ),
          ],
        ),
        actions: !_isLoading
            ? <Widget>[
                ElevatedButton(
                  onPressed: () {
                    setLoginInfos();
                    if (!_isLoading) {
                      submitLogin();
                    }
                  },
                  child: Text('Login'),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  child: Text('Cancel'),
                ),
              ]
            : [
                Container(
                  width: 28.0,
                  height: 28.0,
                  child: CircularProgressIndicator(
                    color: Colors.purple,
                  ),
                ),
              ]);
  }
}
