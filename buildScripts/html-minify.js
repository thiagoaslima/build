const fs = require('fs');
var minify = require('html-minifier').minify;

var args = process.argv.slice(2);
var inputDir = args[0];
var outputDir = args[1];
var folders = []

function getHtmlFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);

    folders.push(dir.replace(inputDir, outputDir));
    
    for (var i in files){
        var name = dir + '/' + files[i];
        
        if (fs.statSync(name).isDirectory()){
            getHtmlFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    
    return files_.filter(name => name.endsWith('.html'));
}

var files = getHtmlFiles(inputDir);

folders.forEach(folder => {
    debugger;
    if (!fs.existsSync(folder)){
        fs.mkdirSync(folder);
    }
});

files.forEach(file => {
    var content = fs.readFileSync(file, 'utf-8');
    
    var minContent = minify(content, {
        caseSensitive: true,
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        processConditionalComments: true,
        removeComments: true,
        sortAttributes: true,
        sortClassName: true
    });

    var newFile = file.replace(inputDir, outputDir);

    fs.writeFile(newFile, minContent, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log(file.replace(inputDir, outputDir), " saved!");
    }); 
})

