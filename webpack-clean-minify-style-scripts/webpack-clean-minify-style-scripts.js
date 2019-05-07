class WebpackCleanMinifyStyleScripts {
  constructor(options = {}) {
      this.srcPath = options.srcFolder.substr(options.srcFolder.lastIndexOf('\\')+1);
      this.removeModules = [];
      this.stylesScripts = [];
      this.stylesFiles = [];
      this.cssAssets = [];//Stylesheets emited
      this.jsAssets= [];//JS files emited
      this.cssAssetNames = [];//Stylesheets file names w/o extension
      
  }

apply(compiler) {
  compiler.hooks.thisCompilation.tap("thisCompilation", (compilation, compilationParams) => {
      compilation.hooks.buildModule.tap("buildModule", module => {
          //Sets a list of modules to be removed and scripts created due an scss included in a js
          if(module.rawRequest != undefined) {
            
              let modulePath = module.rawRequest;
              if(modulePath.includes('scss') && modulePath.substr(0,2) != '!!'){
                this.removeModules.push(module.rawRequest);
              } else if (modulePath.includes('js') && modulePath.includes(this.srcPath) && modulePath.substr(0,2) != '!!' && modulePath.substr(1,2) != ':\\') {
                this.stylesScripts.push(module.rawRequest);
              }
          } 
          
      });
     
  })
      
  compiler.hooks.shouldEmit.tap('shouldEmit', (compilation) => {
        //Generates two arrays, one made of css files and another of js to be outputted
        //Ignores any file with the ~ char(Not sure why theyre there)
        for (let key of Object.keys(compilation.assets)) {  
            if(key.indexOf('~')==-1) {
                switch(key.substr(key.lastIndexOf('.'))){
                    case '.css':
                        this.cssAssets.push(key)
                        this.cssAssetNames.push(key.substr(0, key.indexOf('.')))
                        break;
                    case '.js':
                        this.jsAssets.push(key)
                        break;
                }
            }
         }

        for (let key of Object.keys(compilation.assets)) {  
            if(this.cssAssetNames.find( 
                //Looks for coincidences between the current asset name and the  cssAssetNames array to ignore js assets with the same name than the styles assets
                (elem) => { 
                    return (key.substr(0, key.indexOf('.')) == elem && key.indexOf('.css') == -1) 
                }
            )) {
                let fileContent = compilation.assets[key]._source.children;
                let extraBlock = false, closeBlock = false, delimiter= null, possibleExtra = false, content = '', notExtra = true;
                compilation.assets[key]._source.children.forEach((elem, ind, arr) => {
                    let fileNameString = key.substr(0, key.indexOf('.'));
                    
                    if(typeof elem == 'object'){
                        
                        
                        this.cssAssetNames.forEach(name => {
                            let cursor = 0;//Cursor pointer used to iterate the search string
                            let searchStart ='\\n\\n__webpack_require__';//start seach string
                            let searchFilenameExtension = '.scss';//end filename search string
                            let searchEnd = ');';//end search string
                            let tempItem = elem._value;//Copy original to apply changes
                            let carriageReturn = '\n\n';//used to meassure string offsets
                            while(tempItem.indexOf(searchStart, cursor) != -1){//repeat while there is another searchStart found past the current cursor pointer
                                let start = tempItem.indexOf(searchStart, cursor);//searchStart next position
                                let sassFileEnd = tempItem.indexOf(searchFilenameExtension, start) - searchFilenameExtension.length;//end of filename position
                                //TODO: this may not work properly, I get all comments & stuff
                                let sassFileStart = tempItem.lastIndexOf('/', sassFileEnd);//start of filename position
                                let end = tempItem.indexOf(searchEnd, start)+ searchEnd.length;//searchEnd next position

                                if(start != -1 && end != -1 && sassFileEnd != -1 && sassFileStart != -1) {
                                    let path = tempItem.substr(sassFileStart, sassFileEnd);
                                    let before= tempItem.substr(0, start)//substring before cut point
                                    let after = tempItem.substr(end, elem._value.length)//substring after cut point
                                    elem._value = before+after;
                                }
                                cursor = end;
                            }
                        })
                        //***********
                        //IF ONLY CONTAINS /***/ "./[FILENAME]].js": SET EXTRABLOCK TO TRUE
                        //*************
                        if(possibleExtra && elem._value == 'eval("\\n\\n//# sourceURL=webpack:///'+content+'?");'){
                            extraBlock=true;
                            console.log('object detected to be extra')
                            notExtra = false;
                        } else {
                            console.log('Not an extra object')
                            notExtra = true;
                        }
                        
                    } else if(typeof elem == 'string') {
                        if(!possibleExtra){
                            //****
                            //IF CONTAINS ANY OF THE stylesScripts MAY BE EXTRA possibleExtra = ind
                            //****
                            
                            this.stylesScripts.forEach((filePath) => {
                                if(elem.indexOf(filePath) != -1){
                                    possibleExtra = ind;
                                    content = filePath;
                                }
                            })
                            
                        } else {
                             if(elem.includes('/***/ })') && extraBlock && !notExtra) {//CHANGE \/ to / inside include to make this work
                                closeBlock=true;
                             }
                        }
                        
                        if(notExtra) {
                            if(elem.search('.scss') != -1 || RegExp(/\/\*\*\*\/ ([0-9]+):/).test(elem)) extraBlock=true,delimiter=false,console.log(elem);
                            if(elem.includes('/***/ })') && extraBlock){
                                closeBlock=true;
                                if(arr[ind+1] == ',\n') {
                                   delimiter = true
                                   //console.log('^^^^',ind)
                                 }else {
                                   delimiter = false
                                 }
                            }
                            if(arr[ind+1] == ',\n' && closeBlock) delimiter = true;
                            
                            
                        }
                    }
                    
                    
                    
                    //IF possibleExtra>0 && extrablock && closeBlock loop from possibleExtra till ind setting to ''
                    if(possibleExtra && extraBlock && closeBlock && !notExtra) {
                        for(let n = ind+3; n > possibleExtra-1; n--) { //Not really sure why need those aditions & substractions, but works
                            compilation.assets[key]._source.children[n] = '';
                        }
                        
                        extraBlock = false, closeBlock = false, possibleExtra = false, notExtra = true;
                    } else {
                        if(extraBlock || closeBlock && extraBlock){
                            compilation.assets[key]._source.children[ind] = '';
                            
                            if(delimiter) {
                                compilation.assets[key]._source.children[ind+1] = '';
                                delimiter=!delimiter;
                            }

                            if(closeBlock ) {
                                extraBlock = false, closeBlock = false, possibleExtra = false;
                            }
                        }
                    }
                })
                
                

            } else if (key.indexOf('~'!= -1) && key.indexOf('css')==-1 && key.indexOf('runtime') == -1) {
                delete compilation.assets[key]
            }

         }
        for (let module of compilation._modules) { 
            
            if(this.stylesScripts.find(elem => {return (module[1].rawRequest==elem)})) {
                for (let key of Object.keys(module)) {  
                        
                    
                    if(module[key].source!=undefined){
                        module[key]._source._value = this.removeScssRequire(module[key]._source._value);
                        
                        
                    }
                }
                
            } else {
                      
            }
         }        
        for (let key of Object.keys(compilation.assets)) { 
            let simpleFilename = key.substr(0, key.indexOf('.'));
            
            if(this.cssAssetNames.indexOf(simpleFilename)!= -1 && key.indexOf(".js") != -1) {
                let isEmpty = this.isContentEmpty(compilation.assets[key]._source.children);
                if(isEmpty) {
                    delete compilation.assets[key];
                }
            }
            
        }
        return true;
  })
}
  isContentEmpty(src) {
      let srcCopy = [];
      
      src.forEach((elem, ind, obj)=>{
          if(elem.length != 0) {
              srcCopy.push(elem);
          }
      });
      
      if(srcCopy.length > 6) { return false } else { return true };
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
            */
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
              let fileContent = compilation.assets[filename]._source.children;
              let extraBlock = false, closeBlock = false;
              let blockTitle = '';
                fileContent.forEach((item, ind) => {
                    if(closeBlock && item != ',\n')closeBlock=false, extraBlock = false;//Reset flags
                    if(ind > 1 || ind < fileContent.length){
                        if(typeof item == 'object'){
                            let closeLoop = this.removeCssRelatedObjects(item, fileNameString);
                            removeStatement
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

    while(elem.indexOf('scss', header)!= -1 && !closeLoop){
        if(elem.indexOf('// extracted by mini-css-extract-plugin') != -1){
            closeLoop = true;  
//                                      console.log('Full block dedicated to css');
            item._value = "//Needless css";
        } else if(elem.indexOf('scss', header) != -1) {
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
        } else {
          closeLoop = true;  
        }

    }
    return closeLoop;
  }
  searchJsAssets(assets) {
      for (let filename of Object.keys(assets)) {
          switch(filename.split('.').pop()){
            case 'js':
                for (let cssAsset of this.cssAssets) {
                      if(filename.split('.').shift() == cssAsset.filename.split('.').shift()) {
                        this.jsAssets.push(filename);
                      }
                }
                break;
          }
      }
  }  
  searchCssAssets(assets) {
      for (let filename of Object.keys(assets)) {
        switch(filename.split('.').pop()){
            case 'css':
                this.cssAssets.push({filename, modules:[]});
                break;
        }
      }
  }
  removeStatement(item, fileName) {//Item to search at, and string contained by the statement that has to be deleted
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

        if(start != -1 && end != -1 && sassFileEnd != -1 && sassFileStart != -1) {
            let path = tempItem.substr(sassFileStart, sassFileEnd);
            this.cssAssets.forEach(obj => {//Check every css filename exported
                if(obj.filename == fileName+'.css'){//if name == current filename
                    obj.modules.forEach(module => {//Check all css exported modules
                        if(path.indexOf(module)){//if coincidence found
                            let before= tempItem.substr(0, start)//substring before cut point
                            let after = tempItem.substr(end, item._value.length)//substring after cut point
                            tempItem = before+after;
                        }
                    });
                }
            })
            return tempItem;
        }
        cursor = end;
    }
  }
}

module.exports = WebpackCleanMinifyStyleScripts;
