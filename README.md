

# Authentication Form Graphql
A simple web apps consist of only authentication form.

## Requirements
UNIX like operating system (WSL, Linux, macOS)

### Setup

1. Clone this repo
```sh
git clone git@github.com:ganadipa/Authentication-form-graphql.git
```
2. Copy the .env
```sh
cp .env.example .env
```
3. Fill in the blanks in the .env file
```sh
DB_NAME = <name>
DB_PASSWORD = <password>
```

4. Setup the database. With \<name\> and \<password\> that is used in the .env file
```sh
sudo mysql -u root -p
CREATE DATABASE gqlauth;
EXIT;

sudo mysql -u root -p gqlauth < src/db/seed.sql

sudo mysql -u root -p
CREATE USER '<name>'@'localhost' IDENTIFIED BY '<password>';
GRANT ALL PRIVILEGES ON gqlauth.* TO '<name>'@'localhost';
FLUSH PRIVILEGES;
EXIT;

sudo systemctl start mysql
```

5. Ready for development
```sh
npm run dev
```
