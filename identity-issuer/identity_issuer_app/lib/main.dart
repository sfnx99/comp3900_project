import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Navigation Basics',
      home: LoginPage(),
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
            child: Padding(
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
                            builder: (context) => const HomePage()),
                      );
                    },
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

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final List<Credential> credentials = [];

  void addCredential(Credential credential) {
    setState(() {
      credentials.add(credential);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const BannerWidget(),
        Expanded(
          child: MainScaffold(
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => AddCredentialRoute(
                            onAddCredential: addCredential,
                          ),
                        ),
                      );
                    },
                    child: const Text('Add Credential'),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ViewCredentialsRoute(
                            credentials: credentials,
                          ),
                        ),
                      );
                    },
                    child: const Text('View Credentials'),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) =>
                                const IssueCredentialsRoute()),
                      );
                    },
                    child: const Text('Issue Credentials'),
                  ),
                ],
              ),
            ),
            selectedIndex: 0,
          ),
        ),
      ],
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
  void _onItemTapped(int index) {
    switch (index) {
      case 0:
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const HomePage()),
        );
        break;
      case 1:
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
              builder: (context) =>
                  AddCredentialRoute(onAddCredential: (credential) {})),
        );
        break;
      case 2:
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
              builder: (context) => ViewCredentialsRoute(credentials: [])),
        );
        break;
      case 3:
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
              builder: (context) => const IssueCredentialsRoute()),
        );
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isWideScreen = MediaQuery.of(context).size.width > 600;

    return Scaffold(
      body: widget.body,
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        items: <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: const Icon(Icons.home),
            label: isWideScreen ? 'Home' : '',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.add),
            label: isWideScreen ? 'Add Credentials' : '',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.view_list),
            label: isWideScreen ? 'View Credentials' : '',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.verified),
            label: isWideScreen ? 'Issue Credentials' : '',
          ),
        ],
        currentIndex: widget.selectedIndex,
        selectedItemColor: Colors.amber[800],
        unselectedItemColor: Colors.grey,
        onTap: _onItemTapped,
      ),
    );
  }
}

class AddCredentialRoute extends StatelessWidget {
  final Function(Credential) onAddCredential;

  const AddCredentialRoute({required this.onAddCredential, super.key});

  @override
  Widget build(BuildContext context) {
    final TextEditingController field0 = TextEditingController();
    final TextEditingController field1 = TextEditingController();
    final TextEditingController field2 = TextEditingController();
    final TextEditingController field3 = TextEditingController();
    final TextEditingController field4 = TextEditingController();

    return Column(
      children: [
        const BannerWidget(),
        Expanded(
          child: MainScaffold(
            body: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Add Credential',
                    style: TextStyle(fontSize: 24),
                  ),
                  const SizedBox(height: 20),
                  TextFormField(
                    controller: field0,
                    decoration: const InputDecoration(
                      labelText: 'Name of Credential',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextFormField(
                    controller: field1,
                    decoration: const InputDecoration(
                      labelText: 'Field 1',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextFormField(
                    controller: field2,
                    decoration: const InputDecoration(
                      labelText: 'Field 2',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextFormField(
                    controller: field3,
                    decoration: const InputDecoration(
                      labelText: 'Field 3',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextFormField(
                    controller: field4,
                    decoration: const InputDecoration(
                      labelText: 'Field 4',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
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
                          builder: (context) => ViewCredentialsRoute(
                            credentials: [credential],
                          ),
                        ),
                      );
                    },
                    child: const Text('Add Credential'),
                  ),
                ],
              ),
            ),
            selectedIndex: 1,
          ),
        ),
      ],
    );
  }
}

class ViewCredentialsRoute extends StatelessWidget {
  final List<Credential> credentials;

  const ViewCredentialsRoute({required this.credentials, super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const BannerWidget(),
        Expanded(
          child: MainScaffold(
            body: ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: credentials.length,
              itemBuilder: (context, index) {
                final credential = credentials[index];
                return Card(
                  child: ListTile(
                    title: Text(credential.field0),
                  ),
                );
              },
            ),
            selectedIndex: 2,
          ),
        ),
      ],
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
      // Add more fake credentials as needed
    ];

    return Column(
      children: [
        const BannerWidget(),
        Expanded(
          child: MainScaffold(
            body: ListView.builder(
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
                          Text('${credential.field1}'),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
            selectedIndex: 3,
          ),
        ),
      ],
    );
  }
}

class CredentialDetailRoute extends StatelessWidget {
  final Credential credential;

  const CredentialDetailRoute({required this.credential, super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const BannerWidget(),
        Expanded(
          child: MainScaffold(
            body: Padding(
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
                        onPressed: () {
                          // Handle verify credential
                        },
                        child: const Text('Verify'),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          // Handle revoke credential
                        },
                        child: const Text('Revoke'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            selectedIndex: 3,
          ),
        ),
      ],
    );
  }
}

class BannerWidget extends StatelessWidget {
  const BannerWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: Colors.yellow,
      padding: const EdgeInsets.all(16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            'University Student Credentials',
            style: TextStyle(
              color: Colors.black,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const LoginPage()),
              );
            },
            child: const Text('Logout'),
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
      color: Colors.yellow,
      padding: const EdgeInsets.all(16.0),
      child: const Text(
        'Identity Issuer Page',
        style: TextStyle(
          color: Colors.black,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}
