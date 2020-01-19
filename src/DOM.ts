
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

    function submitAuth() {

        try {
            let auth = { username: (<HTMLInputElement>user).value, password: (<HTMLInputElement>password).value };
            let login = false;

            if (!auth.username || !auth.password) {
                popup.style.display = "block";
                popup.textContent = "Please fill the username and password fields.";
                setTimeout(() => {
                    popup.style.display = "none";
                }, 1000);
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

    function searchKey(key: string) {
        if (userPassed[encodedKey3][key]) {
            copyStringToClipboard(userPassed[encodedKey3][key]);
        }
    }

    function createKey(key: string, value: string) {
        userPassed[encodedKey3][key] = value;
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

    function copyStringToClipboard(str: string) {
        const el = document.createElement('textarea');
        el.style.display = "none";
        el.value = str;
        el.setAttribute('readonly', '');
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }


} catch (e) {
    ipcRenderer.send('error', JSON.stringify(e));
}




