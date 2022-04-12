//const { assert } = require('console');
const fs = require('fs')
//const ACORN_VERSION = "8.7.0";
//const ACORN_WALKER_VERSION = "8.2.0";
//let Parser = null;
//let Walker = null;

const muify = async function () {
    try {
        let pkgJson = await readPackageJson();
        await replacePackageName(pkgJson);
        await replacePackageDescription(pkgJson);
        await replacePackageUrl(pkgJson);
        // await addAcornDevDependency(pkgJson);
        await addKeywords(pkgJson, ["dashboard", "ui", "gui"]);
        await replaceCommiters(pkgJson, ["Uma Sudhan P", "@ollixx"]);
        await replaceNodenames(pkgJson);
        await savePackageJson(pkgJson);

        // await install();

        await replaceReadme();

        await activateMultiUserDashboard();
    } catch (err) {
        console.error(err);
    }
}

const readPackageJson = async function () {
    const data = fs.readFileSync(__dirname + '/../package.json', 'utf8')
    return JSON.parse(data);
}

const savePackageJson = async function (pkgJson) {
    const content = JSON.stringify(pkgJson, null, '\t');
    fs.writeFileSync(__dirname + '/../package.json', content);
    console.log("package.json saved");
}

const addAcornDevDependency = async function (pkgJson) {
    pkgJson.devDependencies.acorn = ACORN_VERSION;
    pkgJson.devDependencies["acorn-walk"] = ACORN_WALKER_VERSION;
}

const replacePackageName = async function (pkgJson) {
    pkgJson.name = "node-red-contrib-mdashboard";
}

const replacePackageDescription = async function (pkgJson) {
    pkgJson.description = "Fork of node-red-dashboard. Adds multi user/client feature to the dashboard";
}

const replacePackageUrl = async function (pkgJson) {
    pkgJson.repository.url = "https://github.com/umasudhan/node-red-contrib-mdashboard.git";
}

const addKeywords = async function (pkgJson, keywordsArr) {
    keywordsArr.forEach(element => {
        if (!pkgJson.keywords.includes(element)) {
            pkgJson.keywords.push(element);
        }
    });
}

const replaceCommiters = async function (pkgJson, commitersArr) {
    pkgJson.contributors = [];
    commitersArr.forEach(element => {
        pkgJson.contributors.push({
            name: element
        });
    });
}

const replaceNodenames = async function (pkgJson) {
    let nodes = pkgJson["node-red"].nodes;
    for (let n in nodes) {
        let node = nodes[n];
        if (n.startsWith("ui_")) {
            delete nodes[n];
            nodes["m" + n] = node;
        }
    };
}

const install = async function () {
    const { exec } = require("child_process");
    const child = exec("npm install");
    const asyncChild = promExec(child);
    await asyncChild;
    Parser = require("acorn");
    Walker = require("acorn-walk");

}

const activateMultiUserDashboard = async function () {
    let uiJs = fs.readFileSync(__dirname + '/../ui.js', 'utf8');

    // uncomment usage of socketid
    uiJs = uiJs.replace("//toEmit.socketid = msg.socketid;", "toEmit.socketid = msg.socketid;");

    // use mui options in settings.js
    uiJs = uiJs.replace("redSettings.ui", "redSettings.mui");
    uiJs = uiJs.replace("settings.path = 'ui';", "settings.path = 'mui';");

    fs.writeFileSync(__dirname + '/../ui.js', uiJs);
}

// decent approach to replace the code using ast (acorn)
/*
const activateMultiUserDashboard = async function () {
    const uiJs = fs.readFileSync(__dirname + '/../ui.js', 'utf8');
    let test = "1 +1; // a comment";
    const ast = Parser.parse(test, { locations: true, trackComments: true });
    assert(ast, "could not parse ast of ui.js");
    // console.log("ast", ast);
    let types = [];
    Walker.full(ast, node => {
        if (!types.includes(node.type)) {
            types.push(node.type);
        }
        if (node.id && node.id.name == "emitSocket") {
            console.log("found a function", node.id ? node.id.name : node.id);
            console.log("body", node.body);
        }
        if (node.type == "Literal" && typeof (node.value) == "string" && node.value.indexOf("/") != -1) {
            console.log("comment", node);
        }
        console.log("node", node);
    });
    console.log("types", types);
}
*/

const replaceReadme = async function () {
    const muiReadme = fs.readFileSync(__dirname + '/mui.README.md', 'utf8');
    fs.writeFileSync(__dirname + '/../README.md', muiReadme);
}

// make exec/child promised
const promExec = function (child) {
    return new Promise(function (resolve, reject) {
        child.addListener("error", reject);
        child.addListener("exit", resolve);
    })
}

muify();