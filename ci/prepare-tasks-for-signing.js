var fs = require('fs');
var path = require('path');
var util = require('./ci-util');

var buildTasksPath = path.join(__dirname, '..', '_build', 'Tasks');
var signingPath = path.join(__dirname, '..', '_signedTasks');

// For each task that changed
if (process.env.task_pattern) {

    // initialize _signedTasks directory
    util.createNewPath(signingPath);

    // Get list of tasks that have changed
    let pattern = process.env.task_pattern;
    if (pattern.startsWith('@(')) {
        // remove the array markers
        pattern = pattern.slice(2, pattern.length - 1);
    }
    const taskFolders = pattern.split('|');

    // For each task folder, add a nuspec file and zip it
    for (i = 0; i < taskFolders.length; i++) {
        const taskFolder = path.join(buildTasksPath, taskFolders[i]);
        const nuspecFilePath = path.join(taskFolder, "task.nuspec");
        const nuspec = `<?xml version="1.0" encoding="utf-8"?><package xmlns="http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd"><metadata><id>${taskFolders[i]}</id><version>0.0.0</version><authors>Microsoft</authors><copyright>© Microsoft Corporation. All rights reserved.</copyright></metadata></package>`
        fs.writeFileSync(nuspecFilePath, nuspec);

        const nupkg = path.join(signingPath, taskFolder + ".nupkg");
        util.compressFolder(taskFolder, nupkg);
    }
}
else {
    console.log('No task_pattern found. No tasks will be signed');
}