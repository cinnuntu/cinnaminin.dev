const input = document.getElementById('input');
const output = document.getElementById('output');

function appendOutput(text) {
  output.textContent += `\n${text}`;
  window.scrollTo(0, document.body.scrollHeight);
}

let currentContext = 'root';

input.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    appendOutput(`> ${cmd}`);
    input.value = '';

    if (cmd === 'info') {
      const browser = navigator.userAgent;
      const location = window.location.href;
      appendOutput(`\nCurrent Location: ${location}\n\nBrowser: ${browser}`);
    } else if (cmd.startsWith('sudo ')) {
      const parts = cmd.split(' ');
      const subCmd = parts[1];
      const password = prompt(`Enter password for '${subCmd}':`);

      try {
        const res = await fetch('/api/sudo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cmd: subCmd, password })
        });
        const data = await res.json();
        appendOutput(data.response);
      } catch (err) {
        appendOutput('Error running sudo command');
      }
    } else if (cmd === 'help') {
      appendOutput(`Available commands:
      - info: Show current site location and browser info
      - whoami: Show username
      - cls: clears the console
      - clear: clears the console
      - uptime: Show current terminal uptime
      - netstat: linux netstat command
      - terminalcolor <name>: Change terminal color
      - sudo <cmd>: Run privileged commands (password)
      - goto <url>: Navigate to any URL on the internet
      - filetree: Show site file structure
      - openfile <filename>: Open a known site file
      - ls: Show site file structure
      - back: Go back to previous menu (if inside mal0 menus)`);
    } else if (cmd === 'netstat') {
      appendOutput(`Active Internet connections (w/o servers)
You do not have permission to view this information. (Blocked)`);
    } else if (cmd === 'netstat -a') {
      appendOutput(`Ports Currently in use:
tcp               20000
tcp               20001
tcp               20002
tcp               25565
tcp               25566
tcp               25567
tcp               25599
tcp               443
tcp               80
udp               19132
udp               8420`);
    } else if (cmd === 'netstat -t') {
      appendOutput(`TCP Ports Currently in use:
tcp               20000
tcp               20001
tcp               20002
tcp               25565
tcp               25566
tcp               25567
tcp               25599
tcp               443
tcp               80`);
    } else if (cmd === 'netstat -u') {
      appendOutput(`UDP Ports Currently in use:
udp               19132
udp               8420`);
    } else if (cmd === 'whoami') {
      appendOutput('guest@cinnaminindev');
    } else if (cmd === 'uptime') {
      const uptime = Math.floor(performance.now() / 1000);
      appendOutput(`Current Terminal Uptime: ${uptime} seconds`);
    } else if (cmd === 'cls' || cmd === 'clear') {
      output.textContent = 'cinnaminin.dev Terminal (1.0.6)';
      currentContext = 'root';
    } else if (cmd === 'terminalcolor') {
      appendOutput(`invalid usage: please provide a valid css color. (EX: pink/#FFC0CB)`);
    } else if (cmd.startsWith('terminalcolor ')) {
      const color = cmd.split(' ')[1];
      const test = new Option().style;
      test.color = color;
      if (test.color === '') {
        appendOutput(`'${color}' is not a valid CSS color.`);
      } else {
        document.documentElement.style.setProperty('--terminal-color', color);
        appendOutput(`Terminal color changed to ${color}`);
      }
    } else if (cmd === 'goto') {
      appendOutput(`invalid usage: please provide a valid link`);
    } else if (cmd.startsWith('goto ')) {
      let url = cmd.split(' ')[1];
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      appendOutput(`Navigating to ${url}...`);
      window.location.replace(url);
    } else if (cmd === 'filetree' || cmd === 'ls') {
      appendOutput(`./
├── index.html
├── projects.html
├── social.html
├── credits.html
├── terminal.html
└── triggerevent.html

Use "openfile <filename>" to navigate.`);
    } else if (cmd === 'back') {
      // Handle going back in menus
      if (currentContext === 'mal0_images') {
        currentContext = 'mal0';
        appendOutput('Back to Mal0.db menu:\n- About\n- ID\n- Images\n\nUse "openfile <name>" to open an item.');
      } else if (currentContext === 'mal0') {
        currentContext = 'root';
        appendOutput('Returned to root menu.');
      } else {
        appendOutput('You are already at the root menu.');
      }
    } else if (cmd.startsWith('openfile ')) {
      const filename = cmd.split(' ')[1];

      const filePaths = {
        'index.html': '/index.html',
        'projects.html': '/projects.html',
        'social.html': '/social.html',
        'credits.html': '/credits.html',
        'terminal.html': '/randomstuffimade/fake_terminal/public/terminal.html',
        'triggerevent.html': '/trigger-event.html'
      };

      if (filename === 'mal0.db') {
        currentContext = 'mal0';
        appendOutput('Opened Mal0.db');
        appendOutput('filetree:\n- About\n- ID\n- Images\n\nUse "openfile <name>" to open an item.');
      } else if (currentContext === 'mal0') {
        if (filename.toLowerCase() === 'about') {
          appendOutput('Mal0 ^^');
        } else if (filename.toLowerCase() === 'id') {
          appendOutput('ID: ELUCID - SCP-1471');
        } else if (filename.toLowerCase() === 'images') {
          currentContext = 'mal0_images';
          appendOutput('Images folder:\n- image1.png\n- image2.png\n- image3.png\n\nUse "openfile <image>" to open an image or "back" to return.');
        } else {
          appendOutput(`"${filename}" not found in Mal0.db.`);
        }
      } else if (currentContext === 'mal0_images') {
        const validImages = ['image1.png', 'image2.png', 'image3.png'];
        if (validImages.includes(filename.toLowerCase())) {
          appendOutput(`Opening image ${filename}...`);
          window.open(`/assets/mal0/images/${filename}`, '_blank');
        } else if (filename.toLowerCase() === 'back') {
          currentContext = 'mal0';
          appendOutput('Back to Mal0.db menu:\n- About\n- ID\n- Images\n\nUse "openfile <name>" to open an item.');
        } else {
          appendOutput(`"${filename}" not found in Images.`);
        }
      } else {
        if (filePaths[filename]) {
          appendOutput(`Opening ${filename}...`);
          window.location.href = filePaths[filename];
        } else {
          appendOutput(`"${filename}" not found.`);
        }
      }
    } else {
      appendOutput('Unknown command. Try "help".');
    }
  }
});
