import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  List<Credential> credentials = [];

  @override
  void initState() {
    super.initState();
    _loadCredentials();
  }

  Future<void> _loadCredentials() async {
    final prefs = await SharedPreferences.getInstance();
    final String? credentialsJson = prefs.getString('credentials');
    if (credentialsJson != null) {
      final List<dynamic> credentialsList = json.decode(credentialsJson);
      setState(() {
        credentials = credentialsList
            .map((credentialJson) => Credential.fromJson(credentialJson))
            .toList();
      });
    }
  }

  Future<void> _saveCredentials() async {
    final prefs = await SharedPreferences.getInstance();
    final String credentialsJson =
        json.encode(credentials.map((c) => c.toJson()).toList());
    await prefs.setString('credentials', credentialsJson);
  }

  void _addCredential(Credential credential) {
    setState(() {
      credentials.add(credential);
    });
    _saveCredentials();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Navigation Basics',
      home: HomePage(
        credentials: credentials,
        addCredential: _addCredential,
      ),
    );
  }
}

class Credential {
  final String field0;
  final String field1;
  final String field2;
  final String field3;
  final String field4;

  Credential({
    required this.field0,
    required this.field1,
    required this.field2,
    required this.field3,
    required this.field4,
  });

  Map<String, dynamic> toJson() => {
        'field0': field0,
        'field1': field1,
        'field2': field2,
        'field3': field3,
        'field4': field4,
      };

  factory Credential.fromJson(Map<String, dynamic> json) => Credential(
        field0: json['field0'],
        field1: json['field1'],
        field2: json['field2'],
        field3: json['field3'],
        field4: json['field4'],
      );
}

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    final TextEditingController emailController = TextEditingController();
    final TextEditingController passwordController = TextEditingController();

    return Scaffold(
      body: Column(
        children: [
          const LoginBannerWidget(),
          Expanded(
            child: Center(
              child: Container(
                width: 300,
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    TextFormField(
                      controller: emailController,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: passwordController,
                      decoration: const InputDecoration(
                        labelText: 'Password',
                        border: OutlineInputBorder(),
                      ),
                      obscureText: true,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      child: const Text('Login'),
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (context) => HomePage(
                              credentials: [],
                              addCredential: (credential) {},
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class HomePage extends StatelessWidget {
  final List<Credential> credentials;
  final Function(Credential) addCredential;

  const HomePage({
    required this.credentials,
    required this.addCredential,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const BannerWidget(),
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.only(top: 30.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 40.0),
                      child: Text(
                        'We facilitate private, secure and fast services',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.justify,
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Padding(
                      padding: EdgeInsets.symmetric(
                          horizontal: 40.0, vertical: 20.0),
                      child: Text(
                        'The Identity Issuer website works seamlessly with service providers and identity owners. It ensures secure, fast, and private identity verification, making it easier for users to access various services online, and for service providers to efficiently verify user identities. As an issuer, your actions play a crucial role in maintaining the integrity and trustworthiness of the entire identity verification ecosystem. By issuing verified credentials, you enable service providers to confidently authenticate users, reducing the risk of fraud and enhancing the overall security of their systems. Your ability to revoke or update credentials ensures that only accurate and up-to-date information is used, thereby preventing unauthorized access and maintaining compliance with regulatory standards. Furthermore, your participation in the identity verification process helps streamline operations for service providers, leading to faster onboarding and improved user experiences.',
                        style: TextStyle(fontSize: 16),
                        textAlign: TextAlign.justify,
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Center(
                      child: Padding(
                        padding: EdgeInsets.symmetric(horizontal: 16.0),
                        child: Text(
                          'Access our Services',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildCredentialBox(
                          context,
                          title: 'Add Credential',
                          description:
                              'Add a new credential to your profile. This will allow you to store and manage your credentials securely. Once added, you will receive a unique URL code that can be used by users and service providers for identity verification.',
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => AddCredentialRoute(
                                  onAddCredential: addCredential,
                                  credentials: credentials,
                                ),
                              ),
                            );
                          },
                        ),
                        _buildCredentialBox(
                          context,
                          title: 'View Credentials',
                          description:
                              'View all your stored credentials. You can manage and update your credentials from this section. Additionally, you can monitor how your credentials are being utilized by service providers, ensuring transparency and control over your identity information.',
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => ViewCredentialsRoute(
                                  credentials: credentials,
                                ),
                              ),
                            );
                          },
                        ),
                        _buildCredentialBox(
                          context,
                          title: 'Issue Credentials',
                          description:
                              'Issue new credentials to users. This allows you to provide verified credentials to others securely. You have the authority to validate and revoke credentials, ensuring the integrity and accuracy of the identity verification process.',
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    const IssueCredentialsRoute(),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCredentialBox(BuildContext context,
      {required String title,
      required String description,
      required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 300,
        height: 260, // Increased height by 30 pixels
        margin: const EdgeInsets.symmetric(horizontal: 20.0),
        padding: const EdgeInsets.symmetric(horizontal: 30.0, vertical: 20.0),
        decoration: BoxDecoration(
          color: Colors.blue[50],
          borderRadius: BorderRadius.circular(10.0),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 10),
            Text(
              description,
              style: const TextStyle(
                fontSize: 14,
              ),
              textAlign: TextAlign.justify,
            ),
          ],
        ),
      ),
    );
  }
}

class AddCredentialRoute extends StatelessWidget {
  final Function(Credential) onAddCredential;
  final List<Credential> credentials;

  const AddCredentialRoute({
    required this.onAddCredential,
    required this.credentials,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final TextEditingController field0 = TextEditingController();
    final TextEditingController field1 = TextEditingController();
    final TextEditingController field2 = TextEditingController();
    final TextEditingController field3 = TextEditingController();
    final TextEditingController field4 = TextEditingController();

    return MainScaffold(
      selectedIndex: 1,
      body: Column(
        children: [
          const BannerWidget(),
          Expanded(
            child: SingleChildScrollView(
              padding:
                  const EdgeInsets.symmetric(horizontal: 40.0, vertical: 16.0),
              child: Card(
                elevation: 4.0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Add Credential',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: field0,
                        decoration: const InputDecoration(
                          labelText: 'Field 0',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: field1,
                        decoration: const InputDecoration(
                          labelText: 'Field 1',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: field2,
                        decoration: const InputDecoration(
                          labelText: 'Field 2',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: field3,
                        decoration: const InputDecoration(
                          labelText: 'Field 3',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: field4,
                        decoration: const InputDecoration(
                          labelText: 'Field 4',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 20),
                      Center(
                        child: ElevatedButton(
                          onPressed: () {
                            final credential = Credential(
                              field0: field0.text,
                              field1: field1.text,
                              field2: field2.text,
                              field3: field3.text,
                              field4: field4.text,
                            );
                            onAddCredential(credential);
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                builder: (context) => ShowAddedCred(
                                  credential: credential,
                                  onBack: () {
                                    Navigator.pushReplacement(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => HomePage(
                                          credentials: [
                                            ...credentials,
                                            credential
                                          ],
                                          addCredential: onAddCredential,
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            );
                          },
                          child: const Text('Add Credential'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class ShowAddedCred extends StatelessWidget {
  final Credential credential;
  final VoidCallback onBack;

  const ShowAddedCred({
    required this.credential,
    required this.onBack,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return MainScaffold(
      selectedIndex: 0,
      body: Column(
        children: [
          const BannerWidget(),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 400.0,
                      padding: const EdgeInsets.all(24.0),
                      decoration: BoxDecoration(
                        color: Colors.lightBlue[50],
                        border: Border.all(color: Colors.black, width: 2.0),
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Center(
                            child: Text(
                              credential.field0,
                              style: const TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),
                          Text(
                            credential.field1,
                            style: const TextStyle(fontSize: 22),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            credential.field2,
                            style: const TextStyle(fontSize: 22),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            credential.field3,
                            style: const TextStyle(fontSize: 22),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            credential.field4,
                            style: const TextStyle(fontSize: 22),
                          ),
                          const SizedBox(height: 40),
                          Center(
                            child: Container(
                              width: 300.0,
                              height: 300.0,
                              decoration: BoxDecoration(
                                border:
                                    Border.all(color: Colors.black, width: 2.0),
                              ),
                              child: const Center(
                                child: Text(
                                  'Replace with valid QR code',
                                  style: TextStyle(fontSize: 20),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Center(
                    child: ElevatedButton(
                      onPressed: onBack,
                      child: const Text('Back to Home'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class ViewCredentialsRoute extends StatelessWidget {
  final List<Credential> credentials;

  const ViewCredentialsRoute({required this.credentials, super.key});

  @override
  Widget build(BuildContext context) {
    return MainScaffold(
      selectedIndex: 2,
      body: Column(
        children: [
          const BannerWidget(),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Card(
                    margin: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Center(
                        child: Text(
                          'Student ID',
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class IssueCredentialsRoute extends StatelessWidget {
  const IssueCredentialsRoute({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Credential> fakeCredentials = [
      Credential(
        field0: 'Student ID',
        field1: 'z1234567',
        field2: 'Faculty of Science',
        field3: '01/01/2000',
        field4: 'John',
      ),
      Credential(
        field0: 'Student ID',
        field1: 'z1234567',
        field2: 'Faculty of Science',
        field3: '01/01/2000',
        field4: 'Sue',
      ),
    ];

    return MainScaffold(
      selectedIndex: 3,
      body: Column(
        children: [
          const BannerWidget(),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: fakeCredentials.length,
              itemBuilder: (context, index) {
                final credential = fakeCredentials[index];
                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            CredentialDetailRoute(credential: credential),
                      ),
                    );
                  },
                  child: Card(
                    margin: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Student ID',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(credential.field1),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class CredentialDetailRoute extends StatelessWidget {
  final Credential credential;

  const CredentialDetailRoute({required this.credential, super.key});

  @override
  Widget build(BuildContext context) {
    return MainScaffold(
      selectedIndex: 2,
      body: Column(
        children: [
          const BannerWidget(),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Requested Credential: ${credential.field0}'),
                  Text('Student ID Number: ${credential.field1}'),
                  Text('Faculty: ${credential.field2}'),
                  Text('Date of Birth: ${credential.field3}'),
                  Text('Full Name: ${credential.field4}'),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      ElevatedButton(
                        onPressed: () {},
                        child: const Text('Verify'),
                      ),
                      ElevatedButton(
                        onPressed: () {},
                        child: const Text('Revoke'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class BannerWidget extends StatelessWidget {
  const BannerWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: Colors.blue[900],
      padding: const EdgeInsets.all(16.0),
      child: Stack(
        children: [
          Center(
            child: const Text(
              'University Student Credentials',
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          Positioned(
            right: 0,
            child: ElevatedButton(
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginPage()),
                );
              },
              child: const Text('Logout'),
            ),
          ),
        ],
      ),
    );
  }
}

class LoginBannerWidget extends StatelessWidget {
  const LoginBannerWidget({super.key});
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: Colors.blue[900], // Very dark blue color
      padding: const EdgeInsets.all(16.0),
      child: const Text(
        'Identity Issuer Page',
        style: TextStyle(
          color: Colors.white,
          fontSize: 24, // Increased font size
          fontWeight: FontWeight.bold,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}

class MainScaffold extends StatefulWidget {
  final Widget body;
  final int selectedIndex;

  const MainScaffold(
      {required this.body, required this.selectedIndex, super.key});

  @override
  _MainScaffoldState createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  List<Credential> credentials = [];

  @override
  void initState() {
    super.initState();
    _loadCredentials();
  }

  Future<void> _loadCredentials() async {
    final prefs = await SharedPreferences.getInstance();
    final String? credentialsJson = prefs.getString('credentials');
    if (credentialsJson != null) {
      final List<dynamic> credentialsList = json.decode(credentialsJson);
      setState(() {
        credentials = credentialsList
            .map((credentialJson) => Credential.fromJson(credentialJson))
            .toList();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isWideScreen = MediaQuery.of(context).size.width > 600;

    return Scaffold(
      body: widget.body,
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.blue[800],
        items: <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: const Icon(Icons.home, size: 30),
            label: isWideScreen ? 'Home' : '',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.add, size: 30),
            label: isWideScreen ? 'Add Credentials' : '',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.view_list, size: 30),
            label: isWideScreen ? 'View Credentials' : '',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.verified, size: 30),
            label: isWideScreen ? 'Issue Credentials' : '',
          ),
        ],
        currentIndex: widget.selectedIndex,
        selectedItemColor: Colors.pink,
        unselectedItemColor: Colors.white,
        selectedLabelStyle: const TextStyle(fontSize: 16, color: Colors.white),
        unselectedLabelStyle:
            const TextStyle(fontSize: 14, color: Colors.white),
        onTap: (index) {
          switch (index) {
            case 0:
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) => HomePage(
                    credentials: credentials,
                    addCredential: (credential) {},
                  ),
                ),
              );
              break;
            case 1:
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) => AddCredentialRoute(
                    onAddCredential: (credential) {},
                    credentials: credentials,
                  ),
                ),
              );
              break;
            case 2:
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      ViewCredentialsRoute(credentials: credentials),
                ),
              );
              break;
            case 3:
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) => const IssueCredentialsRoute(),
                ),
              );
              break;
          }
        },
      ),
    );
  }
}
