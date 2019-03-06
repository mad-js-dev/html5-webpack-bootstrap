class WebpackCleanMinifyStyleScripts {
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
//    compiler.hooks.afterEmit.tap(
//      'WebpackCleanMinifyStyleScripts',
//      (compilation) => {
//          console.log('This is an example plugin!');
//          //console.log(Object.keys(compilation.assets));
//          //console.log(compilation.assets);
//          
//          let cssAssets = [];//Stylesheets emited
//          let jsAssets= [];//JS files to be cleaned
//          
//          console.log('WebpackCleanMinifyStyleScripts: looking for css outputs')
//          for (let filename of Object.keys(compilation.assets)) {
//            switch(filename.split('.').pop()){
//                case 'css':
//                    console.log(`WebpackCleanMinifyStyleScripts: Css file output found:${ filename }`);
//                    cssAssets.push({filename});
//                    break;
//            }
//          }
//          
//          console.log("Searching for Js coincidences");
//          for (let filename of Object.keys(compilation.assets)) {
//              switch(filename.split('.').pop()){
//                case 'js':
//                    for (let cssAsset of cssAssets) {
//                          //console.log(cssAsset, filename)
//                          if(filename.split('.').shift() == cssAsset.filename.split('.').shift()) {
//                            console.log(`WebpackCleanMinifyStyleScripts: JS coincidence found:${ filename }`);
//                            //console.log(compilation.assets[filename]);
//                            jsAssets.push(filename);
//                          }
//                    }
//                    break;
//              }
//          }
//          
//          compilation.hooks.optimize.tap('WebpackCleanMinifyStyleScripts', () => {
//            console.log('*-*-*-*-*-*-*-*-+_Assets are being optimized.');
//          });
//          
//      }
//    )
      compiler.hooks.environment.tap('environment',function(){
    //无参数  1
    
    //调用了，看起来没啥用;
})

compiler.hooks.afterEnvironment.tap('afterEnvironment',function(){
  //无参数 2
    
    //调用了，看起来没啥用;
})

  compiler.hooks.entryOption.tap('entryOption',function(entry){
    
     //entry:string  运行目录  3
     //
  });

  compiler.hooks.afterPlugins.tap('afterPlugins',function(c){
    
    //compiler  4

   // console.log(compilerrr instanceof compiler);
  })

  compiler.hooks.afterResolvers.tap('afterResolvers',function(c){
    //compiler 5
     
  })



  compiler.hooks.beforeRun.tap('beforeRun',function(c){
     
     //compiler 6
     console.log(c==compiler);
  });

  compiler.hooks.run.tap('run',function(c){
    
    //compiler 7
    console.log(c==compiler);
 });

  compiler.hooks.normalModuleFactory.tap('normalModuleFactory',function(normalModuleFactory){
    // normalModuleFactory 8
    

});

compiler.hooks.contextModuleFactory.tap('contextModuleFactory',function(contextModuleFactory){
  // normalModuleFactory 9
  
 
});

compiler.hooks.beforeCompile.tap('beforeCompile',function(compilationParams){
  
  // compilationParams 由一些自有依赖和上面的 normalModuleFactory ,contextModuleFactory构成。 10
  //编译参数创建之后执行。
});

compiler.hooks.compile.tap('compile',function(compilationParams){
  
   //一个新的编译创建之后执行。在有devserver的情况下应该会起作用。 11
   //compilation的钩子在这里之后将不再生效
});


compiler.hooks.thisCompilation.tap('thisCompilation',function(compilation){
  
   //一个新的编译创建之后执行。在有devserver的情况下应该会起作用。 12
});

compiler.hooks.compilation.tap('compilation',function(compilation){ 
  
   //编译创建之后执行。需要再devserver的情况下验证和compile的关系 13
});

compiler.hooks.make.tap('make',function(compilation){
  //无参数  ，异步平行钩子?  14
  
});

compiler.hooks.afterCompile.tap('afterCompile',function(compilation){
    // 15
  
});


compiler.hooks.shouldEmit.tap('shouldEmit',function(compilation){
  //16
  
});

// compiler.hooks.needAdditionalPass.tap('needAdditionalPass',function(compilation){
//   //无参数
//   
// });

compiler.hooks.emit.tap('emit', compilation => {
      //console.log(Object.keys(compilation.assets));
      //console.log(compilation.assets);

      let cssAssets = [];//Stylesheets emited
      let jsAssets= [];//JS files to be cleaned

      console.log('WebpackCleanMinifyStyleScripts: looking for css outputs')
      for (let filename of Object.keys(compilation.assets)) {
        switch(filename.split('.').pop()){
            case 'css':
                //console.log(`WebpackCleanMinifyStyleScripts: Css file output found:${ filename }`);
                cssAssets.push({filename, modules:[]});
                break;
        }
      }
//        console.log('*************************')
//        console.log(cssAssets, "Searching for Js coincidences");
//        console.log('*************************')
      for (let filename of Object.keys(compilation.assets)) {
          switch(filename.split('.').pop()){
            case 'js':
                for (let cssAsset of cssAssets) {
//                      console.log(cssAsset, filename)
                      if(filename.split('.').shift() == cssAsset.filename.split('.').shift()) {
                        //console.log(`WebpackCleanMinifyStyleScripts: JS coincidence found:${ filename }`);
                        //console.log(compilation.assets[filename]);
                        jsAssets.push(filename);
                      }
                }
                break;
          }
      }
    
//        console.log('*************************')
//        console.log(jsAssets, "Searching for Js coincidences");
//        console.log('*************************')
      for (let filename of jsAssets) {
          if(compilation.assets[filename]._source != undefined){//Blocks webpackdevserver
              let fileNameString = filename.substr(0, filename.indexOf('.'));
              //console.log('----------------------------------')
              //console.log(compilation.assets[filename]._source.children)
              //console.log('----------------------------------')
              let fileContent = compilation.assets[filename]._source.children;
              let extraBlock = false, closeBlock = false;
              let blockTitle = '';
                fileContent.forEach((item, ind) => {
                    if(ind > 1 || ind < fileContent.length){
                        if(typeof item == 'object'){
                            //item._value = "";
                            let header = 'eval("\\n\\n__webpack_require__(/*! '.length;//set intial point of search
                            let nameEnd = null;
                            let elem = item._value;
                            let closeLoop = false;
                            //console.log(elem.length)
                            
                            //----Look for __webpack_require__ and set ');' as close elem
                            while(elem.indexOf('scss', header)!= -1 && !closeLoop){
//                                console.log('******');
//                                console.log('Current header:'+ header, 'Next end:'+elem.indexOf('scss', header))
                                if(elem.indexOf('// extracted by mini-css-extract-plugin') != -1){
                                    closeLoop = true;  
//                                    console.log('Full block dedicated to css');
                                    item._value = "//Needless css";
                                } else if(elem.indexOf('scss', header) != -1) {
                                    //console.log(elem.indexOf('scss'), item._value.substr(0,225));
                                    let blockpath = elem.substr(0, elem.indexOf('.scss', header));//get full path without extension
                                    let blockname = blockpath.substr(header.length);
                                    blockname = blockname.substr(blockname.lastIndexOf('/')+1);
                                    cssAssets.forEach(obj => {
                                        if(obj.filename == fileNameString+'.css' && !obj.modules.includes(blockname)) {
                                            
                                            obj.modules.push(blockname);
                                        }
                                    })
                                    header = elem.indexOf('.scss', header) + '.scss'.length;
//                                    console.log(header, elem.length)
                                } else {
                                  closeLoop = true;  
                                }
                                
//                                console.log('******');
                            }
                        } else if(typeof item == 'string') {
                            if(item.search('.scss') != -1){
                                extraBlock=true;
                                if(item.includes('/***/ })'))closeBlock=true;
                                //console.log(item);
                                //console.log(item, `extraBlock: ${item.includes('scss')}`);
                            }
                        }
                        
                        if(extraBlock || closeBlock && extraBlock) fileContent[ind] = '//scss'/*, cssAssets[filename].modules.push()*/;
                        if(closeBlock)closeBlock=false, extraBlock = false;//Reset flags
                    }
                });
              
          }
      }
      console.log(cssAssets);
        
    
      for (let file of jsAssets) {
        if(compilation.assets[file]._source != undefined){//Blocks webpackdevserver
          let extraBlock = false, closeBlock = false, possibleExtraBlock = null, tempValue = '';
          let fileName = file.substr(0, file.indexOf('.')), blockTitle = null;//trim file extension
          let fileContent = compilation.assets[file]._source.children;
          let header = 'eval("\\n\\n__webpack_require__(/*! ';
          fileContent.forEach((item, ind) => {
              if(ind > 1 || ind < fileContent.length){
                    if(typeof item == 'object'){
                        if(possibleExtraBlock>0) {
                            console.log("''''''''''''''''''''''''''''");
                            console.log(item._value)
                            
                            
                            let cursor = 0;
                            let searchStart ='\\n\\n__webpack_require__';
                            let searchFilenameExtension = '.scss';
                            let searchEnd = ');';
                            let tempItem = item._value;
                            let carriageReturn = '\n\n';
                            while(tempItem.indexOf(searchStart, cursor) != -1){
                                let start = tempItem.indexOf(searchStart, cursor);
                                let sassFileEnd = tempItem.indexOf(searchFilenameExtension, start) - searchFilenameExtension.length;
                                let sassFileStart = tempItem.lastIndexOf('/', sassFileEnd);
                                let end = tempItem.indexOf(searchEnd, start)+ searchEnd.length;
                                console.log(start, end);
                                
                                if(start != -1 && end != -1 && sassFileEnd != -1 && sassFileStart != -1) {
                                    let path = tempItem.substr(sassFileStart, sassFileEnd);
                                    cssAssets.forEach(obj => {
                                        if(obj.filename == fileName+'.css'){
                                            obj.modules.forEach(module => {
                                                console.log('*', path);
                                                if(path.indexOf(module)){
                                                    let before= tempItem.substr(0, start)
                                                    let after = tempItem.substr(end, item._value.length)
                                                    tempItem = before+after;
                                                    console.log('---',tempItem);
                                                }
                                            });
                                        }
                                    })
                                }
                                cursor = end;
                            }
                            console.log(tempItem);
                            console.log("''''''''''''''''''''''''''''");
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
});
compiler.hooks.afterEmit.tap('afterEmit',function(compilation){
  //生成资源到 output 目录之后。  18
  
});

compiler.hooks.done.tap('done',function(stats){
  //编译完成  19
  
});

compiler.hooks.failed.tap('failed',function(error){
  //编译失败
  
});

compiler.hooks.invalid.tap('invalid',function(fileName, changeTime){
  //监听模式下，编译无效时。
  
});

compiler.hooks.watchClose.tap('watchClose',function(){
  //监听模式停止。
  
});
  }
}

module.exports = WebpackCleanMinifyStyleScripts;

/*cssAssets.forEach(obj => {
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