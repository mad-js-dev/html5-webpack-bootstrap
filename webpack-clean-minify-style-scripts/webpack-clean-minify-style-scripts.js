class WebpackCleanMinifyStyleScripts {
  constructor(options = {}) {
      this.srcPath = options.srcFolder.substr(options.srcFolder.lastIndexOf('\\')+1);
      
      console.log(this.srcPath)
  }
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
  compiler.hooks.compilation.tap("compilation", compilation => {
      compilation.plugin("succeed-module", module => {
        // this will be called for every successfully built module, but before it's parsed and
        // its dependencies are built. The built source is available as module._source.source()
        // and you can add additional dependencies like so:
          if(module.rawRequest != undefined) {
              let modulePath = module.rawRequest;
              if(modulePath.includes('scss') && modulePath.substr(0,2) != '!!'){
                //console.log('*****************************')
                //console.log(module.rawRequest)  
                module._source = ''
                //console.log(module._source)  
              } else if (modulePath.includes('js') && modulePath.includes(this.srcPath) && modulePath.substr(0,2) != '!!' && modulePath.substr(1,2) != ':\\') {
                console.log('*****************************')
                console.log(module._source)    
                console.log(module.rawRequest)    
                //console.log(this.removeScssRequire(module._source._value))  
                //module._source._value = this.removeScssRequire(module._source._value);
              }
          } 
      })
    })
    compiler.hooks.emit.tap('emit', compilation => {
          //console.log(Object.keys(compilation.assets));
          //console.log(compilation.assets);

          this.cssAssets = [];//Stylesheets emited
          this.jsAssets= [];//JS files to be cleaned

          /*this.searchCssAssets(compilation.assets);
          this.searchJsAssets(compilation.assets);
          this.removeStylesBlocks(compilation);
          console.log('--------')
          console.log(this.cssAssets);
          console.log(this.jsAssets);
          console.log('--------')
          this.removeScssRequires(compilation);
          this.cleanEmptyLines(compilation);*/
        
          /*
          for (let file of this.jsAssets) {
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
                                if(item.includes(' })'))closeBlock=true;
                                //console.log(item);
                                //console.log(item, `extraBlock: ${item.includes('scss')}`);
                            }
                      }
                  });
              }
            }*/
        
        /*for (let filename of this.jsAssets) {
           if(compilation.assets[filename]._source != undefined) {
                let fileContent = compilation.assets[filename]._source.children;
                console.log(fileContent);
           }
        }*/
    });

  }
  removeScssRequire(src){
      let opening = '\n\nrequire("';
      let closing = ');'
      let contentSearch = 'scss';
     
      let start;
      while((start = src.indexOf(opening)) != -1){
        let end = src.indexOf(closing, start) + closing.length;
        console.log(start,end,src.substr(start, end - start))
        src = src.replace(src.substr(start, end - start ), '');
        if(src == '"use strict";')src = '';
      }
      console.log(src)
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
      for (let file of this.jsAssets) {
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