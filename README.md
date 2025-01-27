﻿# SimpleHoneypot

## Project Overview
This honeypot simulates a vulnerable server environment tailored to attract cyber attackers, particularly targeting (small to medium sized) industries like law firms that handle sensitive data. Leveraging a Large Language Model (LLM) backend integrated with a realistic frontend, the system engages attackers through convincing interactions. By capturing attacker behavior, the honeypot provides critical insights to enhance cybersecurity strategies.

## Objectives
1. **Engage Attackers**: Mimic a realistic environment that encourages prolonged interaction to gather insights.
2. **Prevent LLM Self-Identification**: Ensure the LLM remains undetectable to maintain deception.

## Project Features
- **Frontend Simulation**: The interface mimics outdated systems (e.g., Windows XP) to create a low-security appearance, encouraging attackers to interact further.
- **LLM Integration**: The backend uses LLM to generate responses that simulate authentic server behavior, enhancing the realism of the environment.
- **Caching and Whitelisting**: To prevent the LLM from revealing itself, responses are cached and whitelisted, with out-of-date data flushed periodically.
- **Data Logging**: All interactions, including keystrokes and file access, are securely logged for detailed analysis.

## Installation
1. **Setup Environment**:
   - Clone the repository.
   - Download and install XAMPP: https://sourceforge.net/projects/xampp/
   - Open XAMPP, start Apache and MySQL.
   - After running Apache and MySQL, click on Admin in MySQL, this will lead you to the database page. (Check the notification on the page to see if MySQL server is successfully connected)
    
* **In Case Of Error**: Open MySQL (run in wsl terminal 'service mysql start' then run 'mysql')
    ```bash
     service mysql start
     mysql
     ```
   - Set password for root user ( replace your_password ):
     ```sql
     ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
     GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
     FLUSH PRIVILEGES;
     ```
     - Then, open 'config.inc.php' file in the XAMPP file downloaded (xampp/phpMyAdmin/config.inc.php).
     - Find the password for user root and change it to the password that you set, also change the 'AllowNoPassword' to 'false'.
   - Create a user to access the MySQL server ( if asked for password, then replace '' ):
     ```sql
     CREATE USER 'pma'@'localhost' IDENTIFIED BY '';
     GRANT ALL PRIVILEGES ON *.* TO 'pma'@'localhost';
     FLUSH PRIVILEGES;
     ```
2. **Install Dependencies**:
   - install NodeJS: https://nodejs.org/en
   - open Command Prompt and install npm:
        ```bash
        npm install
        ```
3. **Configure API Keys and Database**:
   - Add .env file (contains the GPT API key) attached with the submitted github directory, ENSURE that the file name is '.env' in the directory.
   - Add user root password to the MySQL connection in the 'server.js' file in the directory.
4. **Start Server**:
   - Back to the Command Prompt and run:
        ```bash
        npm start
        ```

## Project Structure

**/src**: Contains the core application files.
  - **LLMController.js**: Manages LLM-related traffic, validates requests, and controls response caching.
  - **LLMPower.js**: Generates LLM responses based on request types.
  - **Database and File Cache**: Stores cached responses and logs user interactions.
