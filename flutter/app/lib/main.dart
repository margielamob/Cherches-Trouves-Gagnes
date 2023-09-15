import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      initialRoute: '/',
      routes: {
        '/': (context) => MainPage(),
        '/pageA': (context) => PageA(),
        '/pageB': (context) => PageB(),
        '/prototype': (context) => PrototypePage(),
      },
    );
  }
}

class MainPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  children: [
                    Padding(
                      padding: EdgeInsets.fromLTRB(0, 25, 60, 0),
                      child: Row(
                        children: [
                          Text(
                            'Jeux de différences',
                            style: TextStyle(
                                fontSize: 35, fontWeight: FontWeight.bold),
                          ),
                          SizedBox(width: 20),
                          Image.asset(
                            'logoJdD.png',
                            width: 100,
                            height: 100,
                          ),
                        ],
                      ),
                    ),
                    SizedBox(height: 70),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/pageA');
                      },
                      child: Text('Go to Page A'),
                    ),
                    SizedBox(height: 50),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/pageB');
                      },
                      child: Text('Go to Page B'),
                    ),
                    SizedBox(height: 100),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/prototype');
                      },
                      child: Text('Go to Prototype'),
                    ),
                    SizedBox(height: 50),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/pageD');
                      },
                      child: Text('Go to Page D'),
                    ),
                    SizedBox(height: 30),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          'Équipe 103:',
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        Padding(
                            padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                            child: Text(
                              'Thierry, Ahmed El, Ahmed Ben, Skander, Samy',
                              style: TextStyle(
                                  fontSize: 15, fontWeight: FontWeight.w400),
                            ))
                      ],
                    )
                  ],
                ),
                Column(
                  children: [
                    Row(
                      children: [
                        Image.asset(
                          'quote.png',
                          width: 500,
                          height: 800,
                        ),
                      ],
                    )
                  ],
                )
              ],
            )
          ],
        ),
      ),
    );
  }
}

class PageA extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Page A'),
      ),
      body: Center(
        child: Text(
          'This is Page A',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}

class PageB extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Page B'),
      ),
      body: Center(
        child: Text(
          'This is Page B',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}

class PrototypePage extends StatelessWidget {
  sendMessage() {
    print('Message sent');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Adjusting TextField Width Example'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Container(
                  width: 200.0,
                  height: 200.0,
                  decoration: BoxDecoration(
                    border: Border.all(
                      width: 3.0,
                      color: Colors.blue,
                    ),
                    borderRadius: BorderRadius.all(Radius.circular(8.0)),
                  )),
              SizedBox(height: 16.0),
              Container(
                width: 200.0, // Set the desired width
                child: TextField(
                  decoration: InputDecoration(
                    labelText: 'Enter your text',
                    border: OutlineInputBorder(),
                  ),
                ),
              ),
              SizedBox(height: 16.0),
              // Send Button
              Container(
                width: 200.0, // Set the desired width
                child: ElevatedButton(
                  onPressed: sendMessage,
                  child: Text('Send'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
