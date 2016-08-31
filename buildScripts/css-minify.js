const fs = require('fs');
var autoprefixer = require('autoprefixer');
var postcss = require('postcss');
var CleanCSS = require('clean-css');
var config = {
    cleanCSS: { debug: false }
};

var args = process.argv.slice(2);
var inputDir = args[0];
var outputDir = args[1];
var folders = [];

function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);

    folders.push(dir.replace(inputDir, outputDir));

    for (var i in files) {
        var name = dir + '/' + files[i];

        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }

    return files_;
}

var files = getFiles(inputDir).filter(name => name.endsWith('.css'));

folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
});

var contents = files.map(file => fs.readFileSync(file, 'utf-8'));

/*
var minContents = contents.map(content => {
    new CleanCSS(config.cleanCSS).minify(content)
});
*/

files.forEach((file, index) => {
    if (file === 'dev/locais/listaLocais.styles.css') {
        debugger;
    }
    var newFile = file.replace(inputDir, outputDir);
    var content = contents[index];

    postcss([ autoprefixer ]).process(content).then( (result) => {
        if (file === 'dev/locais/listaLocais.styles.css') {
            debugger;
        }
        result.messages.forEach(message => console.log(message.type, '(' + message.column + ':' + message.line + ')', message.text))
        var content = new CleanCSS(config.cleanCSS).minify(result.css).styles.replace(/'\\/g, "'@#$___HASH_OCTAL___@#$");

        fs.writeFile(newFile, content, function (err) {
            if (err) {
                return console.log(err);
            }

            console.log(file.replace(inputDir, outputDir), " saved!");
        });
    }).catch( err => {
        console.log( newFile, " NOT SAVED!");
        console.warn(err);
        throw err;
    })

});

