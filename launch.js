(async () => {
    let thread = new Promise(async (resolve, reject) => {

        let c = await require('child_process').execSync(command,
            { cwd: this.templateDir },
            (err, stdout, stderr) => {
                if (stderr || err) reject(stderr || err);
                console.log(`[CHILD] ${stdout}`);
                resolve();
            });
    });
})()
