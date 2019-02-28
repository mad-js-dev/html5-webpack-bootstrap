class WebpackCleanMinifyStyleScripts {
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    // Specify the event hook to attach to
    compiler.hooks.afterEmit.tap(
      'WebpackCleanMinifyStyleScripts',
      (compilation) => {
          console.log('This is an example plugin!');
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
          
          console.log("Searching for Js coincidences");
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
          
          compilation.hooks.optimize.tap('WebpackCleanMinifyStyleScripts', () => {
            console.log('*-*-*-*-*-*-*-*-+_Assets are being optimized.');
          });
          
      }
    )
  }
}

module.exports = WebpackCleanMinifyStyleScripts;