const fs = require('fs');

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



var files = getFiles(inputDir).filter(name => name.endsWith('.ts'));

folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
});

function evalConfig(str) {
    // ATENCAO: eval is evil
    // Não usar esse codigo externamente
    var json;
    var _err = true;

    while (_err) {
        try {
            eval('json =' + str);
            _err = false;
        } catch (err) {
            if (err.name === 'ReferenceError') {
                var varName = err.message.replace(' is not defined', '');
                eval('var ' + varName + ' = ' + undefined);
            }
            _err = true;
        }
    }

    return json;
}

files.forEach(file => {
    console.log(file);
    

    var path = file.split('/').slice(0, -1).join('/') + '/';
    var content = fs.readFileSync(file, 'utf-8');

    if (file === 'step1/idioma/seletor-idioma.component.ts') {
                debugger;
            }

    if (content.indexOf('@Component') >= 0) {
        //var regex = /@Component\(([^}]*})\)/g;
        var regex = /@Component\(([\s\S]*)\)[\s\n]*export/; 
        var configs = regex.exec(content);

        if (!configs || !configs.length) {
            return content;
        } else {
            configs = configs.slice(1);
        }
        if (file === 'step1/idioma/seletor-idioma.component.ts') {
                debugger;
            }


        // em cada configuração de componente, 
        // busca se há as propriedades templateUrl e stylesUrls 
        // e substitui seus valores pelo arquivo
        var configsMod = configs.map(config => {

            if (config.indexOf('templateUrl') >= 0) {
                var regexComentado = /\/\/[\s]*(templateUrl: ([^,\n}]*))/;
                var resultsComent = regexComentado.exec(content); 

                var regex = /(templateUrl: ([^,\n}]*))/;
                var results = regex.exec(content);

                if (results.length && !resultsComent) {
                    var html = fs.readFileSync(path + results[2].trim().slice(1, -1), 'utf-8');
                    config = config.replace(results[1], "template: `" + html + "`");
                }
            }

            if (config.indexOf('styleUrls') >= 0) {
                var regexComentado = /\/\/[\s]*(templateUrl: ([^,\n}]*))/;
                var resultsComent = regexComentado.exec(content); 

                var regex = /(styleUrls: \[([^\]]*))/;
                var results = regex.exec(content);
                var array = results[2].split(',').filter(name => !!name);

                if (results.length && !resultsComent) {
                    var styles = array.map(url => fs.readFileSync(path + url.trim().slice(1, -1), 'utf-8')).join(' ');
                    config = config.replace(results[1], 'styles: [`' + styles + '`');
                }
            }

            // não é necessário o módulo uma vez que os arquivos passam a ser inline
            if (config.indexOf('moduleId') >= 0) {
                var regex = /(moduleId: ([^\n}]*))/;
                var results = regex.exec(content);
                config = config.replace(results[0], '');
            }
            

            return config;
        });

        configs.forEach((config, idx) => {
            content = content.replace(config, configsMod[idx]);
        });
    }

    var newFile = file.replace(inputDir, outputDir);

    console.log(file, newFile);

    fs.writeFile(newFile, content, function (err) {
        console.log(newFile, err);
        if (err) {
            return console.log(err);
        }

        console.log(file.replace(inputDir, outputDir), " saved!");
    });

});