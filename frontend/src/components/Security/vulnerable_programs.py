import sqlite3
import os

## SQL injection vulnerability
def login(username, password):
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'"
    c.execute(query)
    result = c.fetchone()
    
    conn.close()
    
    return result

## Sensitive Data Expodure
def read_file(filename):
    with open(filename, 'r') as file:
        data = file.read()
    print(data)