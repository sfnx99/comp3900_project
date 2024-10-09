import 'package:flutter/material.dart';
import 'verify_credential.dart'; // Import the new page

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Spotiphy',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: Colors.green,
        toolbarHeight: 80.0,
        title: const Padding(
          padding: EdgeInsets.symmetric(horizontal: 32.0),
          child: Text(
            'Spotiphy',
            style: TextStyle(
              color: Colors.black,
              fontSize: 24.0,
            ),
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32.0),
            child: Row(
              children: [
                TextButton(
                  onPressed: () {},
                  child: const Text(
                    'Premium',
                    style: TextStyle(
                      color: Colors.black,
                      decoration: TextDecoration.underline,
                      fontSize: 18.0,
                    ),
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: const Text(
                    'Support',
                    style: TextStyle(
                      color: Colors.black,
                      decoration: TextDecoration.underline,
                      fontSize: 18.0,
                    ),
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: const Text(
                    'Download',
                    style: TextStyle(
                      color: Colors.black,
                      decoration: TextDecoration.underline,
                      fontSize: 18.0,
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.account_circle,
                      color: Colors.black, size: 30.0),
                  onPressed: () {},
                ),
              ],
            ),
          ),
        ],
      ),
      body: Center(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            buildBanner(
              title: 'Individual Premium',
              price: 'A\$15 / month',
              description:
                  '1 Premium Account\nCancel Anytime\n Free for 1 Month',
              buttonText: 'Try Free for 1 Month',
              titleColor: Colors.pink[200]!,
              buttonColor: Colors.pink[200]!,
              onPressed: () {},
            ),
            const SizedBox(width: 20.0),
            buildBanner(
              title: 'Student Premium',
              price: 'A\$7 / month',
              description:
                  '1 verified Premium account\nEligible for students\nCancel Anytime',
              buttonText: 'Try Free for 1 Month',
              titleColor: Colors.purple[200]!,
              buttonColor: Colors.purple[200]!,
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => VerifyCredential()),
                );
              },
            ),
            const SizedBox(width: 20.0),
            buildBanner(
              title: 'Family',
              price: 'A\$24 / month',
              description:
                  'Up to 6 Premium accounts\nCancel Anytime\nAccess to Spotiphy Kids',
              buttonText: 'Get Premium Family',
              titleColor: Colors.lightBlue[200]!,
              buttonColor: Colors.lightBlue[200]!,
              onPressed: () {},
            ),
          ],
        ),
      ),
    );
  }

  Widget buildBanner({
    required String title,
    required String price,
    required String description,
    required String buttonText,
    required Color titleColor,
    required Color buttonColor,
    required VoidCallback onPressed,
  }) {
    return Container(
      width: 250.0,
      height: 350.0,
      child: Card(
        color: const Color.fromARGB(255, 71, 70, 70),
        elevation: 5.0,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 20.0,
                  fontWeight: FontWeight.bold,
                  color: titleColor,
                ),
              ),
              Text(
                price,
                style: const TextStyle(fontSize: 18.0, color: Colors.white),
              ),
              Text(
                description,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 16.0, color: Colors.white),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: buttonColor,
                ),
                onPressed: onPressed,
                child: Text(buttonText),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
