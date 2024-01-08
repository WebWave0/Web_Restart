const express = require('express');
const { exec } = require('child_process');
const app = express();

const scripts = [
  { name: 'Script 1', path: 'start.bat' },
  { name: 'Script 2', path: 'start1.bat' },
  { name: 'Script 3', path: 'start2.bat' },
  // Добавьте другие файлы по аналогии
];

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
  const buttons = scripts.map(script => `<form action="/${script.path}" method="get"><button type="submit" class="btn btn-primary">${script.name}</button></form>`).join('');
  const statusInfo = `<p class="mb-3">${status_message}</p>`;
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Express App</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    </head>
    <body>
        <div class="container mt-5">
            <h1 class="mb-3">Express App</h1>
            ${statusInfo}
            <ul class="mb-3">
                ${log.map(entry => `<li>${entry}</li>`).join('')}
            </ul>
            ${buttons}
        </div>
    </body>
    </html>
  `);
});

scripts.forEach(script => {
  app.get(`/${script.path}`, (req, res) => {
    log = [];
    status_message = '';
    console.log(`Request for the ${script.name}.`);
    const statusInfo = `<p class="mb-3">${status_message}</p>`;
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Express App - ${script.name}</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
      </head>
      <body>
          <div class="container mt-5">
              <h1 class="mb-3">${script.name}</h1>
              ${statusInfo}
              <form action="/${script.path}/start" method="get">
                  <button type="submit" class="btn btn-primary mb-3">Start</button>
              </form>
              <form action="/${script.path}/restart" method="get">
                  <button type="submit" class="btn btn-warning mb-3">Restart</button>
              </form>
              <form action="/${script.path}/stop" method="get">
                  <button type="submit" class="btn btn-danger mb-3">Stop</button>
              </form>
              <form action="/" method="get">
                  <button type="submit" class="btn btn-secondary mb-3">Back to Main</button>
              </form>
          </div>
      </body>
      </html>
    `);

    app.get(`/${script.path}/start`, (req, res) => {
      const command = `start cmd /c "${script.path}"`;
      console.log(`Request to start ${script.name}.`);
      console.log(`Executing command for start: ${command}`);
      runFile(command);
      res.redirect(`/${script.path}`);
    });

    app.get(`/${script.path}/restart`, (req, res) => {
      const command = `taskkill /F /IM cmd.exe`;
      console.log(`Request to restart ${script.name}.`);
      console.log(`Executing command for restart: ${command}`);
      runFile(command);
      setTimeout(() => {
        const startCommand = `start cmd /c "${script.path}"`;
        console.log(`Executing command for restart: ${startCommand}`);
        runFile(startCommand);
      }, 3000);
      res.redirect(`/${script.path}`);
    });

    app.get(`/${script.path}/stop`, (req, res) => {
      const command = `taskkill /F /IM cmd.exe`;
      console.log(`Request to stop ${script.name}.`);
      console.log(`Executing command for stop: ${command}`);
      runFile(command);
      status_message = `${script.name} successfully stopped.`;
      res.redirect(`/${script.path}`);
    });
  });
});


const port = 3000;
const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});