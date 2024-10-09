import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:qr_flutter/qr_flutter.dart';

class VerifyCredential extends StatefulWidget {
  @override
  _VerifyCredentialState createState() => _VerifyCredentialState();
}

class _VerifyCredentialState extends State<VerifyCredential> {
  String? qrCodeUrl;

  @override
  void initState() {
    super.initState();
    _generateQRCode();
  }

  Future<void> _generateQRCode() async {
    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/generate-session'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final sessionUrl = data['url'];
        setState(() {
          qrCodeUrl = sessionUrl;
        });
      } else {
        // Handle error
        print('Error generating QR code: ${response.statusCode}');
      }
    } catch (error) {
      // Handle error
      print('Error: $error');
    }
  }

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
              qrCodeUrl == null
                  ? CircularProgressIndicator()
                  : Image.network(
                      'http://localhost:3000/qr/${Uri.encodeComponent(qrCodeUrl!)}',
                      width: 200.0,
                      height: 200.0,
                      errorBuilder: (context, error, stackTrace) {
                        return const Center(
                          child: Text(
                            'Error loading QR code',
                            style: TextStyle(color: Colors.red),
                          ),
                        );
                      },
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
