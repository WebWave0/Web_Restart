const express = require('express');
const { exec } = require('child_process');
const app = express();

const file_path_key = 'FILE_PATH';
const file_path = process.env[file_path_key] || '\\path\\to\\your\\file';

let log = [];
let status_message = '';

function runFile(command) {
  try {
    console.log(`Executing command: ${command}`);
    const process = exec(command, (error, stdout, stderr) => {
      if (stdout) {
        console.log(`STDOUT: ${stdout}`);
      }
      if (stderr) {
        console.error(`STDERR: ${stderr}`);
      }

      if (error) {
        console.error(`Error: ${error.message}`);
        log.push(`STDERR: ${error.message}`);
        status_message = 'Error executing command.';
      } else {
        console.log('Command executed successfully.');
        status_message = 'Command executed successfully.';
      }
    });

    process.on('exit', (code) => {
      console.log(`Command execution completed with code ${code}`);
    });
  } catch (e) {
    console.error(`Exception: ${e.message}`);
    log.push(`Exception: ${e.message}`);
    status_message = 'Error executing command.';
  }
}

app.get('/', (req, res) => {
  console.log('Request for the main page.');
  res.send(renderPage());
});

app.get('/start', (req, res) => {
  log = [];
  status_message = '';
  console.log('Request to start the file.');
  const command = `start cmd /c "${file_path}"`;
  runFile(command);
  status_message = 'File successfully started.';
  res.redirect('/');
});

app.get('/restart', (req, res) => {
  log = [];
  status_message = '';
  console.log('Request to restart the file.');
  const command = `taskkill /F /IM cmd.exe && start cmd /c "${file_path}"`;
  runFile(command);
  //таймер на 3 сек перед запуском
  setTimeout(() => {
    console.log('Restarting the file after 3 seconds.');
    const restartCommand = `start cmd /c "${file_path}"`;
    runFile(restartCommand);
  }, 3000);
  status_message = 'File successfully restarted.';
  res.redirect('/');
});

app.get('/stop', (req, res) => {
  log = [];
  status_message = '';
  console.log('Request to stop the file.');
  const command = 'taskkill /F /IM cmd.exe';
  runFile(command);
  status_message = 'File successfully stopped.';
  res.redirect('/');
});

function renderPage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Express App</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iK7t9i6U8+EKjDYt2jviKqEAzoFj/RH8xuFqjmeEWO0j3lG6ZQ6brz9O0" crossorigin="anonymous">
    </head>
    <body>
        <div class="container mt-5">
            <h1 class="mb-3">Express App</h1>
            <p class="mb-3">${status_message}</p>
            <ul class="mb-3">
                ${log.map(entry => `<li>${entry}</li>`).join('')}
            </ul>
            <form action="/start" method="get">
                <button type="submit" class="btn btn-primary mb-3">Start</button>
            </form>
            <form action="/restart" method="get">
                <button type="submit" class="btn btn-warning mb-3">Restart</button>
            </form>
            <form action="/stop" method="get">
                <button type="submit" class="btn btn-danger mb-3">Stop</button>
            </form>
        </div>
    </body>
    </html>
  `;
}

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
