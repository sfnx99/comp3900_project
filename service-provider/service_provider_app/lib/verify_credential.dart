import 'package:flutter/material.dart';

class VerifyCredential extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: Colors.green,
        toolbarHeight: 80.0,
        title: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32.0),
          child: GestureDetector(
            onTap: () {
              Navigator.popUntil(context, (route) => route.isFirst);
            },
            child: const Text(
              'Spotiphy',
              style: TextStyle(
                color: Colors.black,
                fontSize: 24.0,
              ),
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
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32.0, vertical: 16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'Verify Your Student Credentials',
                style: TextStyle(
                  fontSize: 24.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20.0),
              const Text(
                'Scan the QR code below to verify your student status.',
                style: TextStyle(fontSize: 16.0, color: Colors.white),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20.0),
              Container(
                width: 200.0,
                height: 200.0,
                color: Colors.white,
                child: const Center(
                  child: Text(
                    'QR Code Placeholder',
                    style: TextStyle(color: Colors.black),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
