class WebpackCleanMinifyStyleScripts {
  constructor(options = {}) {
      this.srcPath = options.srcFolder.substr(options.srcFolder.lastIndexOf('\\')+1);
      this.removeModules = [];
      this.stylesScripts = [];
      this.stylesFiles = [];
      //console.log(this.srcPath)
  }
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
  compiler.hooks.thisCompilation.tap("thisCompilation", (compilation, compilationParams) => {
      compilation.hooks.buildModule.tap("buildModule", module => {
          if(module.rawRequest != undefined) {
              let modulePath = module.rawRequest;
              if(modulePath.includes('scss') && modulePath.substr(0,2) != '!!'){
                console.log('Module added to remove list: '+modulePath) 
                this.removeModules.push(module.rawRequest);
              } else if (modulePath.includes('js') && modulePath.includes(this.srcPath) && modulePath.substr(0,2) != '!!' && modulePath.substr(1,2) != ':\\') {
                console.log('Module added to js list: '+module.rawRequest) 
                this.stylesScripts.push(module.rawRequest);
              }
          } 
          
          console.log(this.removeModules)
          console.log(this.stylesScripts)
      });
     
  });
  compiler.hooks.compilation.tap("compilation", (compilation, compilationParams) => {
        for (let key of Object.keys(compilation)) {  
              //console.log(compilation[key]);
         }
         //console.log('---',compilation.name)
     compilation.hooks.succeedModule.tap("succeedModule", module => {
         
     });
  })
  compiler.hooks.compilation.tap("compilation", compilation => {
      // return true to emit the output, otherwise false
        this.cssAssets = [];//Stylesheets emited
        this.jsAssets= [];//JS files to be cleaned
        for (let key of Object.keys(compilation.assets)) {  
            console.log(key)
            //console.log(key.substr(0, key.indexOf('.'))+key.substr(key.lastIndexOf('.')));

            if(key.indexOf('~')==-1) {
                switch(key.substr(key.lastIndexOf('.'))){
                    case '.css':
                        console.log('**',key.substr(0, key.indexOf('.')));
                        this.cssAssets.push(key.substr(0, key.indexOf('.')))
                        break;
                    case '.js':
                        this.jsAssets.push(key.substr(0, key.indexOf('.')))
                        break;
                }
            }
         }
      
        console.log('--',this.cssAssets);
        console.log('--',this.jsAssets);
      
         for (let key of Object.keys(compilation.assets)) {  
            if(this.cssAssets.find( 
                (elem) => { return (key.substr(0, key.indexOf('.')) == elem && key.indexOf('.css') == -1) }
            )) {
                console.log(compilation.assets[key]);
                
            }

         }
  })
      
  compiler.hooks.shouldEmit.tap('shouldEmit', (compilation) => {
        // return true to emit the output, otherwise false
        this.cssAssets = [];//Stylesheets emited
        this.jsAssets= [];//JS files to be cleaned
        for (let key of Object.keys(compilation.assets)) {  
            console.log(key)
            //console.log(key.substr(0, key.indexOf('.'))+key.substr(key.lastIndexOf('.')));

            if(key.indexOf('~')==-1) {
                switch(key.substr(key.lastIndexOf('.'))){
                    case '.css':
                        console.log('**',key.substr(0, key.indexOf('.')));
                        this.cssAssets.push(key.substr(0, key.indexOf('.')))
                        break;
                    case '.js':
                        this.jsAssets.push(key.substr(0, key.indexOf('.')))
                        break;
                }
            }
         }
      
//        console.log('--',this.cssAssets);
//        console.log('--',this.jsAssets);
      
         for (let key of Object.keys(compilation.assets)) {  
            if(this.cssAssets.find( 
                (elem) => { return (key.substr(0, key.indexOf('.')) == elem && key.indexOf('.css') == -1) }
            )) {
                //console.log(compilation.assets[key]._source.children);
                let fileContent = compilation.assets[key]._source.children;
                let extraBlock = false, closeBlock = false, delimiter= null;

                    //console.log(compilation.assets[key]._source.children)  
                compilation.assets[key]._source.children.forEach((elem, ind, arr) => {
                    let fileNameString = key.substr(0, key.indexOf('.'));

                    if(typeof elem == 'object'){
                      //let closeLoop = this.removeCssRelatedObjects(item, fileNameString);
                    } else if(typeof elem == 'string') {
                        if(elem.search('.scss') != -1)extraBlock=true,delimiter=false;
                        if(elem.includes('/***/ })') && extraBlock){
                            closeBlock=true;
                            if(arr[ind+1] == ',\n') {
                               delimiter = true
                               closeBlock = false;
                             }else {
                               delimiter = false
                             }
                            console.log(delimiter)
                        }
                        //if(elem.includes(',') && closeBlock) delimiter = true;
                    }
                    console.log('*-*', delimiter, compilation.assets[key]._source.children[ind] )
                    if(extraBlock || closeBlock && extraBlock || delimiter && extraBlock){
                        compilation.assets[key]._source.children[ind] = '';
                        if(closeBlock && !delimiter || delimiter && !closeBlock) {
                            extraBlock = false, closeBlock = false, delimiter = null;
                        }
                    }
//                   
                })
                
                
//                for (let [line, ind] of compilation.assets[key]._source.children) {
//                    console.log(line)  
//                    let fileNameString = key.substr(0, key.indexOf('.'));
//
//                  let fileContent = compilation.assets[key]._source.children;
//                  let extraBlock = false, closeBlock = false, delimiter= false;
//                  let blockTitle = '';
//                    
//                  if(typeof line == 'object'){
//                        //let closeLoop = this.removeCssRelatedObjects(item, fileNameString);
//                  } else if(typeof line == 'string') {
//                        if(line.search('.scss') != -1)extraBlock=true,delimiter=false;
//                        if(line.includes('/***/ })') && extraBlock)closeBlock=true;
//                        if(line.includes(',') && closeBlock) delimiter = true;
//                  }
//                    
//                  if(extraBlock || closeBlock && extraBlock || delimiter) compilation.assets[key]._source.children[ind] = '';
//                    
//                }
            }

         }
        for (let module of compilation._modules) { 
            
            /*console.log(this.removeModules);
            console.log(this.stylesScripts);*/
            if(this.stylesScripts.find(elem => {return (module[1].rawRequest==elem)})) {
                //console.log(module[1].rawRequest);
                for (let key of Object.keys(module)) {  
                    if(module[key].source!=undefined){
                        module[key]._source._value = this.removeScssRequire(module[key]._source._value);
                        //console.log(key, module[key]);
                        
                        //remove style blocks
                        
                    }
                }
                
            } else {
                      
            }
         }
        //console.log(compilation.name)
        
        
        return true;
    });
      
    compiler.hooks.afterEmit.tap('afterEmit', compilation => {
        for (let key of Object.keys(compilation.assets)) {  
            //console.log(key.substr(0, key.indexOf('.')));
            
        };
        
        for (let key of Object.keys(compilation.assets)) {  
              //console.log(key.substr(0, key.indexOf('.'))+key.substr(key.lastIndexOf('.')));
         }
        compilation.hooks.optimize.tap("optimize", module => {
          //console.log(module)
        });
    });

  }
    
    
  removeScssRequire(src){
      let opening = '\n\nrequire("';
      let closing = ');'
      let contentSearch = 'scss';
     
      let start;
      while((start = src.indexOf(opening)) != -1){
        let end = src.indexOf(closing, start) + closing.length;
        //console.log(start,end,src.substr(start, end - start))
        src = src.replace(src.substr(start, end - start ), '');
        if(src == '"use strict";')src = '//file to be removed';
      }
      //console.log(src)
      return src;
  }
  cleanEmptyLines(compilation) {
          
      for (let filename of this.jsAssets.slice(0).reverse()) {
        let fileContent = compilation.assets[filename]._source;
        if(fileContent != undefined) {//Dev server blocker
            //console.log(fileContent.slice(0).reverse());
            /*for(let [key, item] of fileContent.slice(0).reverse()) {
                let positiveIndex = (fileContent.length-1)-key;
                console.log(fileContent.length);
                if(item==''){
                    resultContent = fileContent.slice(0, positiveIndex).concat(fileContent.slice(fileContent.slice(0, positiveIndex)+1))
                }
            }
            console.log(resultContent);*/
        }    
      }
  }
  removeScssRequires(compilation) {
      for (let file of this.stylesScripts) {
            if(compilation.assets[file]._source != undefined){//Blocks webpackdevserver
              let extraBlock = false, closeBlock = false, possibleExtraBlock = null, tempValue = '';
              let fileName = file.substr(0, file.indexOf('.')), blockTitle = null;//trim file extension
              let fileContent = compilation.assets[file]._source.children;
              let header = 'eval("\\n\\n__webpack_require__(/*! ';
              fileContent.forEach((item, ind) => {
                  if(ind > 1 || ind < fileContent.length){
                        if(typeof item == 'object'){
                            if(possibleExtraBlock>0) {
                                item._value = this.removeStatement(item, fileName);
                            }
                        } else if(typeof item == 'string') {
                            if(!possibleExtraBlock && item.includes(fileName))possibleExtraBlock=ind;
                            if(possibleExtraBlock)
                            blockTitle = item
                            if(item.includes('/***/ })'))closeBlock=true;
                            //console.log(item);
                            //console.log(item, `extraBlock: ${item.includes('scss')}`);
                        }
                  }
              });
            }
      }
  } 
  removeStylesBlocks(compilation) {
    for (let filename of this.jsAssets) {
          if(compilation.assets[filename]._source != undefined){//Blocks webpackdevserver
              let fileNameString = filename.substr(0, filename.indexOf('.'));
//                console.log('----------------------------------')
//                console.log(compilation.assets[filename]._source.children)
//                console.log('----------------------------------')
              let fileContent = compilation.assets[filename]._source.children;
              let extraBlock = false, closeBlock = false;
              let blockTitle = '';
                fileContent.forEach((item, ind) => {
                    if(closeBlock && item != ',\n')closeBlock=false, extraBlock = false;//Reset flags
                    if(ind > 1 || ind < fileContent.length){
                        if(typeof item == 'object'){
                            let closeLoop = this.removeCssRelatedObjects(item, fileNameString);
                        } else if(typeof item == 'string') {
                            if(item.search('.scss') != -1)extraBlock=true;
                            if(item.includes('/***/ })') && extraBlock)closeBlock=true;
//                              console.log(item, `extraBlock: ${item.includes('scss')}`);
                        }

                        if(extraBlock || closeBlock && extraBlock) fileContent[ind] = '';
                        
                    }
                });

          }
      }
  }
  removeCssRelatedObjects(item, stlyesheetName) {
    let header = 'eval("\\n\\n__webpack_require__(/*! '.length;//set intial point of search
    let nameEnd = null;
    let elem = item._value;
    let closeLoop = false;
//                                console.log(elem.length)

    //----Look for __webpack_require__ and set ');' as close elem
    while(elem.indexOf('scss', header)!= -1 && !closeLoop){
//                                    console.log('******');
//                                    console.log('Current header:'+ header, 'Next end:'+elem.indexOf('scss', header))
        if(elem.indexOf('// extracted by mini-css-extract-plugin') != -1){
            closeLoop = true;  
//                                      console.log('Full block dedicated to css');
            item._value = "//Needless css";
        } else if(elem.indexOf('scss', header) != -1) {
//                                      //console.log(elem.indexOf('scss'), item._value.substr(0,225));
            let blockpath = elem.substr(0, elem.indexOf('.scss', header));//get full path without extension
            let blockname = blockpath.substr(header.length);
            blockname = blockname.substr(blockname.lastIndexOf('/')+1);
            this.cssAssets.forEach(obj => {
                if(obj.filename == stlyesheetName+'.css' && !obj.modules.includes(blockname)) {
                    obj.modules.push(blockname);
                }
            })
            header = elem.indexOf('.scss', header) + '.scss'.length;
            closeLoop = false;  
//                                        console.log(header, elem.length)
        } else {
          closeLoop = true;  
        }

//                                    console.log('******');
    }
    return closeLoop;
  }
  searchJsAssets(assets) {
      for (let filename of Object.keys(assets)) {
          switch(filename.split('.').pop()){
            case 'js':
                for (let cssAsset of this.cssAssets) {
//                      console.log(cssAsset, filename)
                      if(filename.split('.').shift() == cssAsset.filename.split('.').shift()) {
                        //console.log(`WebpackCleanMinifyStyleScripts: JS coincidence found:${ filename }`);
                        //console.log(compilation.assets[filename]);
                        this.jsAssets.push(filename);
                      }
                }
                break;
          }
      }
  }  
  searchCssAssets(assets) {
      console.log('WebpackCleanMinifyStyleScripts: looking for css outputs')
      for (let filename of Object.keys(assets)) {
        switch(filename.split('.').pop()){
            case 'css':
                //console.log(`WebpackCleanMinifyStyleScripts: Css file output found:${ filename }`);
                this.cssAssets.push({filename, modules:[]});
                break;
        }
      }
  }
  removeStatement(item, fileName) {//Item to search at, and string contained by the statement that has to be deleted
//    console.log("''''''''''''''''''''''''''''", this);
//    console.log(item._value)
    let cursor = 0;//Cursor pointer used to iterate the search string
    let searchStart ='\\n\\n__webpack_require__';//start seach string
    let searchFilenameExtension = '.scss';//end filename search string
    let searchEnd = ');';//end search string
    let tempItem = item._value;//Copy original to apply changes
    let carriageReturn = '\n\n';//used to meassure string offsets
    while(tempItem.indexOf(searchStart, cursor) != -1){//repeat while there is another searchStart found past the current cursor pointer
        let start = tempItem.indexOf(searchStart, cursor);//searchStart next position
        let sassFileEnd = tempItem.indexOf(searchFilenameExtension, start) - searchFilenameExtension.length;//end of filename position
        //TODO: this doesnt work properly, I get all comments & stuff
        let sassFileStart = tempItem.lastIndexOf('/', sassFileEnd);//start of filename position
        let end = tempItem.indexOf(searchEnd, start)+ searchEnd.length;//searchEnd next position
//        console.log(start, end);

        if(start != -1 && end != -1 && sassFileEnd != -1 && sassFileStart != -1) {
            let path = tempItem.substr(sassFileStart, sassFileEnd);
            this.cssAssets.forEach(obj => {//Check every css filename exported
                if(obj.filename == fileName+'.css'){//if name == current filename
                    obj.modules.forEach(module => {//Check all css exported modules
//                        console.log('*', path);
                        if(path.indexOf(module)){//if coincidence found
                            let before= tempItem.substr(0, start)//substring before cur point
                            let after = tempItem.substr(end, item._value.length)//substring after cut point
                            tempItem = before+after;
//                            console.log('---',tempItem);
                        }
                    });
                }
            })
            return tempItem;
        }
        cursor = end;
    }
//    console.log(tempItem);
//    console.log("''''''''''''''''''''''''''''");    
  }
}

module.exports = WebpackCleanMinifyStyleScripts;

/*this.cssAssets.forEach(obj => {
    if(obj.filename == fileName+'.css') {
        obj.modules.forEach((sassFilename, ind) => {
            if(item._value.search(sassFilename+'.scss')){
               let firstSentenceStart = 5;//takes eval out
               let firstSentenceEnd = item._value.search(';') + 1;
               let m = 0;
               console.log(tempValue, item._value);
               while(m<item._value.length){
                   if(m >= firstSentenceStart && m <= firstSentenceEnd) {
                       tempValue = item._value.substr(0, firstSentenceStart)+item._value.substr(firstSentenceEnd, item._value.length+1)
                       //TODO. check if content only have a surcemap properly
                       //let isEmpty = tempValue.search('\\n\\n//# sourceURL=webpack:///./src/styles/'+fileName+'}.js?");')
                       //if(isEmpty)extraBlock=true;
                       //----------------------------------------------------------
                       console.log(tempValue, firstSentenceStart, firstSentenceEnd);
                   }
                   m++;
               }
            }
        })
    }
})*/