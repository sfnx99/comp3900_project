import json
import re

# Input file path (will be overwritten)
INPUT_FILES = ["./app/IdentityIssuer/src/config.json", 
               "./app/IdentityOwner/walletapp/app/config.json", 
               "./app/ServiceProvider/University-Housing/uni-housing/src/config.json", 
               "./app/ServiceProvider/UNSW-employer/src/config.json", 
               "./app/ServiceProvider/UNSW-exams/src/config.json", 
               "./app/config.json",
               "./services/service_provider/src/config.json"]

# Function to replace IP in URLs
def update_ip_in_url(url, new_ip):
    return re.sub(r"http://[^:]+(:\d+)", f"http://{new_ip}\\1", url)

# Prompt the user for the new IP address
NEW_IP = input("Enter the new IP address: ").strip()

# Validate the input IP address
if not re.match(r"^\d{1,3}(\.\d{1,3}){3}$", NEW_IP):
    print("Error: Invalid IP address format. Please provide a valid IP address.")
    exit(1)
for INPUT_FILE in INPUT_FILES:
    # Read the JSON object from the input file
    with open(INPUT_FILE, "r") as file:
        data = json.load(file)

    # Update IP addresses
    try: 
        data["credential_endpoint"] = update_ip_in_url(data["credential_endpoint"], NEW_IP)
    except: 
        pass
    data["IPaddress"] = NEW_IP
    data["wallet_url"] = update_ip_in_url(data["wallet_url"], NEW_IP)
    data["issuer_url"] = update_ip_in_url(data["issuer_url"], NEW_IP)
    data["verifier_url"] = update_ip_in_url(data["verifier_url"], NEW_IP)

    # Overwrite the input file with the updated JSON object
    with open(INPUT_FILE, "w") as file:
        json.dump(data, file, indent=4)

    print(f"Updated JSON saved to {INPUT_FILE}")