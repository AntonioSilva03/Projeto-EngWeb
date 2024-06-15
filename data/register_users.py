import requests
import json

url = 'http://localhost:7778/users/register'
file_path = './users.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

    for user in data:
        if requests.post(url, json=user, headers={'Content-Type': 'application/json'}):
            print(f"User {user['nome']} registered successfully")
        else:
            print(f"User {user['nome']} registration failed")

admin_url = 'http://localhost:7778/users/register/admin'

admin = {
    "nome": "Administrador",
    "email": "admin@ucwebsites.com",
    "password": "admin"
}

if requests.post(admin_url, json=admin, headers={'Content-Type': 'application/json'}):
    print(f"User {admin['nome']} registered successfully")
else:
    print(f"User {admin['nome']} registration failed")