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
                console.log(`WebpackCleanMinifyStyleScripts: Css file output found:${ filename }`);
                cssAssets.push({filename});
                break;
        }
      }
    
      console.log(cssAssets, "Searching for Js coincidences");
      for (let filename of Object.keys(compilation.assets)) {
          switch(filename.split('.').pop()){
            case 'js':
                for (let cssAsset of cssAssets) {
                      //console.log(cssAsset, filename)
                      if(filename.split('.').shift() == cssAsset.filename.split('.').shift()) {
                        console.log(`WebpackCleanMinifyStyleScripts: JS coincidence found:${ filename }`);
                        //console.log(compilation.assets[filename]);
                        jsAssets.push(filename);
                      }
                }
                break;
          }
      }
      for (let filename of jsAssets) {
          
          console.log("*-*-*-*-**-*-*-*-*-*-*-*-*-*--*-*-")
          let fileContent = compilation.assets[filename]._source.children;
            fileContent.forEach((item, ind) => {
                if(typeof item == 'object'){
                    //item._value = "";
                    console.log(item._value.substr(0,225)+'...');
                } else {
                    console.log(item);
                }
            });
          console.log("*-*-*-*-**-*-*-*-*-*-*-*-*-*--*-*-")
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