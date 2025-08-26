const input = document.getElementById('input');
const output = document.getElementById('output');

function appendOutput(text) {
  output.innerHTML += `\n${text}`;
  window.scrollTo(0, document.body.scrollHeight);
}

let currentContext = 'root';
let menuActive = false;
let menuIndex = 0;
let currentMenuItems = [];
let menuContainer = null;

function clearTerminal() {
  output.textContent = 'cinnaminin.dev Terminal (1.0.7)';
}

function renderMenu(title, items) {
  if (!menuContainer) {
    menuContainer = document.createElement("div");
    output.appendChild(menuContainer);
  }

  let menuHTML = `<div>${title}</div>`;
  items.forEach((item, i) => {
    if (i === menuIndex) {
      menuHTML += `<div><span class="highlight">> ${item}</span></div>`;
    } else {
      menuHTML += `<div>&nbsp;&nbsp;${item}</div>`;
    }
  });

  menuContainer.innerHTML = menuHTML;
}

input.addEventListener('keydown', async (e) => {
  // ---- MENU NAV IG ----
  if (menuActive) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      menuIndex = (menuIndex - 1 + currentMenuItems.length) % currentMenuItems.length;
      renderMenu(currentContext === "mal0" ? "mal0.db contents:" : "Images:", currentMenuItems);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      menuIndex = (menuIndex + 1) % currentMenuItems.length;
      renderMenu(currentContext === "mal0" ? "mal0.db contents:" : "Images:", currentMenuItems);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const selected = currentMenuItems[menuIndex].toLowerCase();

if (currentContext === "mal0") {
  if (selected === "about") {
    clearTerminal();
    appendOutput(`
mal0.db/About:

Item #: SCP-1471
Object Class: Euclid

Special Containment Procedures: All mobile devices that have SCP-1471 installed are to be confiscated and analyzed for any potential leads to other possibly affected devices. Afterwards, affected devices are to have their batteries removed, be assigned a designation (e.g. SCP-1471-#), and be placed in Storage Unit-91 at Research Site-45.

Description: SCP-1471 is a free 9.8MB application for mobile devices named "MalO ver1.0.0" in online application stores. SCP-1471 has no listed developer and is somehow able to bypass the application approval process to go directly to distribution. SCP-1471 is also able to avoid removal by other program manager applications. After SCP-1471 is installed, no icons or shortcuts are created for the application. SCP-1471 will then begin to send the individual images through text messaging every 3-6 hours. All images will contain SCP-1471-A either within the background or foreground. SCP-1471-A appears as a large humanoid figure with a canid-like skull and black hair.

During the first 24 hours following the installation of SCP-1471, the mobile device will receive images taken at locations commonly frequented by the individual. After 48 hours, the mobile device will receive images taken at locations that were recently visited by the individual. After 72 hours, the mobile device will receive images of the individual in real time with SCP-1471-A appearing within close proximity to the subject. Individuals with >90 hours of exposure to these continuous images will begin to briefly visualize SCP-1471-A within their peripheral vision, reflective surfaces, or a combination of the two.

Continued exposure to SCP-1471 after this point will cause irreversible and sustained visualizations of SCP-1471-A. Individuals at this stage have reported periodic attempts made by SCP-1471-A to visually communicate with them, but fail to understand or comprehend these actions. Currently the only known treatment to reverse SCP-1471's effect is to eliminate the individual's visual exposure to these images prior to 90 hours after installation. To date, no apparent hostile activity has been reported regarding SCP-1471-A.

But most importantly: remember not to be afraid! As for Mal0 is very nice! She will make you happy and much more :3
-CinnaMal0
`);
    currentContext = "about";
    menuActive = false;
    menuContainer = null;
  } else if (selected === "id") {
    // continue...
          clearTerminal();
          appendOutput("\nmal0.db/ID:\nItem #: SCP-1471\nObject Class: Euclid\n");
          currentContext = "id";
          menuActive = false;
          menuContainer = null;
        } else if (selected === "images") {
          clearTerminal();
          currentContext = "mal0_images";
          menuIndex = 0;
          currentMenuItems = ["image1.png", "image2.png", "image3.png"];
          appendOutput("mal0.db/Images:");
          menuContainer = null;
          menuActive = true;
          renderMenu("Images:", currentMenuItems);
        }
      } else if (currentContext === "mal0_images") {
        clearTerminal();
        const file = currentMenuItems[menuIndex];
        appendOutput(`Opening ${file}...`);
        window.open(`/assets/mal0/images/${file}`, '_blank');
        appendOutput("\n[Press Backspace to return]");
        currentContext = "image_opened";
        menuActive = false;
      }
      return;
    }
  }

  if (e.key === "Backspace") {
    if (currentContext === "about" || currentContext === "id") {
      clearTerminal();
      currentContext = "mal0";
      menuActive = true;
      menuIndex = 0;
      currentMenuItems = ['About', 'ID', 'Images'];
      menuContainer = null;
      renderMenu("mal0.db contents:", currentMenuItems);
      e.preventDefault();
    } else if (currentContext === "mal0_images" || currentContext === "image_opened") {
      clearTerminal();
      currentContext = "mal0";
      menuActive = true;
      menuIndex = 0;
      currentMenuItems = ['About', 'ID', 'Images'];
      menuContainer = null;
      renderMenu("mal0.db contents:", currentMenuItems);
      e.preventDefault();
    } else if (currentContext === "mal0") {
      clearTerminal();
      currentContext = "root";
      menuActive = false;
      menuContainer = null;
      appendOutput(`./
├── index.html
├── projects.html
├── social.html
├── credits.html
├── terminal.html
├── triggerevent.html
└── mal0.db

Use "openfile <filename>" to open a file.`);
      e.preventDefault();
    }
  }

  // ---- COMMANDS ----
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
      - ls: Show site file structure`);
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
      clearTerminal();
      currentContext = 'root';
      menuActive = false;
      menuContainer = null;
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
├── triggerevent.html
└── mal0.db

Use "openfile <filename>" to open a file.`);
    } else if (cmd === 'back') {
      if (currentContext === 'mal0' || currentContext === 'mal0_images' || currentContext === 'image_opened') {
        clearTerminal();
        currentContext = 'root';
        menuActive = false;
        menuContainer = null;
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
        clearTerminal();
        currentContext = 'mal0';
        menuActive = true;
        menuIndex = 0;
        currentMenuItems = ['About', 'ID', 'Images'];
        appendOutput("mal0.db has successfully loaded!\n(use ↑/↓ to navigate, Enter to open, Backspace to return)");
        menuContainer = null;
        renderMenu("mal0.db contents:", currentMenuItems);
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
