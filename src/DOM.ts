
const { ipcRenderer } = require('electron');

console.log = (data) => {
    ipcRenderer.send('log', data);
}

let userPassed;

const tabNumber = 4;
let childTree = {};

let JSONStorage = ipcRenderer.send('getJSON');
ipcRenderer.on('receive', (event, data) => {
    JSONStorage = data;
    ipcRenderer.send("log", JSONStorage);
});

for (let i = 1; i <= tabNumber; i++) {
    childTree[`child${i}`] = document.getElementById(`c${i}`);
}

try {
    navigate(1);

    let user: HTMLElement = document.getElementById("input1");
    let password: HTMLElement = document.getElementById("input2");
    let popup: HTMLElement = document.getElementById("popup");
    popup.style.display = "none";

    const encodedKey0 = (Buffer.from("table")).toString('base64');
    const encodedKey1 = (Buffer.from("username")).toString('base64');
    const encodedKey2 = (Buffer.from("password")).toString('base64');
    const encodedKey3 = (Buffer.from("data")).toString('base64');

    function activatePopup(message: string, type?: string, ms?: number) {
        switch (type) {
            case "err":
            case "error":
                popup.className = "alert";
                break;
            case "warn":    
            case "warning":
                popup.className = "alert-warning";
                break;
            case "success":    
            case "ok":
            default:
                popup.className = "alert-success";    
                break;    
        }
        popup.style.display = "block";
        popup.textContent = message;
        setTimeout(() => {
            popup.style.display = "none";
        }, ms ? ms : 1000);
    }

    function submitAuth() {

        try {
            let auth = { username: (<HTMLInputElement>user).value, password: (<HTMLInputElement>password).value };
            let login = false;

            if (!auth.username || !auth.password) {
                activatePopup("Please fill the username and password fields!", "err");
                return;
            }

            let pwBuffer = (Buffer.from(auth.password)).toString('base64');
            let userBuffer = (Buffer.from(auth.username)).toString('base64');

            if (!JSONStorage[encodedKey0].length) {
                userPassed = createUser(userBuffer, pwBuffer);
            }
            else {
                userPassed = JSONStorage[encodedKey0].find(k => {
                    if (k[encodedKey1] === userBuffer && k[encodedKey2] === pwBuffer) {
                        login = true;
                        return k;
                    }
                });

                if (!userPassed) createUser(userBuffer, pwBuffer);
            }

            if (!login) ipcRenderer.send("writeFile", JSONStorage);
            else console.log("Logged in!");
            navigate(2);

        } catch (e) {
            ipcRenderer.send('error', e);
        }
    }

    function createUser(user, pw) {
        try {
            JSONStorage[encodedKey0].push({ [encodedKey1]: user, [encodedKey2]: pw, [encodedKey3]: {} });
            return { [encodedKey1]: user, [encodedKey2]: pw, [encodedKey3]: {} };
        } catch (e) {
            ipcRenderer.send('error', e);
        }
    }

    function searchKey() {
        const i3: HTMLElement = document.getElementById("input3");
        let key = (<HTMLInputElement>i3).value;

        if (userPassed[encodedKey3][key]) {
            copyTextToClipboard(userPassed[encodedKey3][key]);
        }
        else activatePopup("Please input a key for gathering!", "warn");
    }

    function createKey() {
        const i4: HTMLElement = document.getElementById("input4");
        const i5: HTMLElement = document.getElementById("input5");

        let key = (<HTMLInputElement>i4).value;
        let value = (<HTMLInputElement>i5).value;

        userPassed[encodedKey3][key] = value;

        ipcRenderer.send("writeFile", JSONStorage);
    }

    function navigate(tabNumber: number) {
        switch (tabNumber) {
            case 1:
                removeNodeExcept(1);
                break;
            case 2:
                removeNodeExcept(2);
                break;
            case 3:
                removeNodeExcept(3);
                break;
            case 4:
                removeNodeExcept(4);
                break;
        }
    }

    function removeNodeExcept(n: number) {

        for (let i = 1; i <= tabNumber; i++) {
            try {
                if (i !== n && childTree[`child${i}`]) document.body.removeChild(childTree[`child${i}`]);
                else if (i === n) document.body.appendChild(childTree[`child${i}`]);
            } catch (e) {
                continue;
            }
        }
    }

    function copyTextToClipboard(str: string) {
        var textArea = document.createElement("textarea");
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = str;

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const copy = document.execCommand('copy');
            const code = copy ? 0 : 1;
            ipcRenderer.send('log', `Copy exited with code ${code}.`);
                
            if (!code) activatePopup("Copied your key to clipboard!");
            else activatePopup("Sorry! Failed to copy :(", "err");

        } catch (err) {
            ipcRenderer.send('error', err);
        }
        document.body.removeChild(textArea);
    }



} catch (e) {
    ipcRenderer.send('error', JSON.stringify(e));
}




