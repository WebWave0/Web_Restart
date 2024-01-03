# Express App for File Execution

This is a simple Express web application for executing a file on the server. It provides basic functionality to start, restart, and stop a specified file using commands. The web interface allows easy control of the file execution process.

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/WebWave0/web_restart.git
   
2.  Change into the project directory:
   
	cd web_restart
	
3.	Install dependencies:
	
	npm install
	
### Usage 

1. 	Start the Express server:
	
	npm start

2.	Open your browser and go to http://localhost:3000 to access the web interface.

### Features

	・ Start: Execute the specified file.
	・ Restart: Terminate the current file execution, wait for 3 seconds, then start the file again.
	・ Stop: Terminate the current file execution.
	
### Customization

You can customize the file path by setting the FILE_PATH environment variable. If not set, the default path is used.

Example:

FILE_PATH=/path/to/your/file npm start

### Existing Endpoints

	・ GET /: Main page displaying the current status, logs, and control buttons.
	・ GET /start: Start the specified file.
	・ GET /restart: Restart the specified file after terminating the current execution.
	・ GET /stop: Stop the currently executing file.
	
### Requests and Their Purposes

	・ GET /start: Initiates the execution of the specified file.
	・ GET /restart: Restarts the specified file, terminating the current execution first.
	・ GET /stop: Stops the currently executing file.