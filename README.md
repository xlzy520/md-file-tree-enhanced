# md-file-tree-enhanced

Generate markdown tree of all the files in a directory, recursively.Custom directory name, file name
生成文件目录列表到Markdown文件中，可以设置过滤的文件后缀名,或自定义目录名、文件名

## How to use?

### Install the script
```bash
npm i md-file-tree-enhanced
# or pnpm or yarn
```

### Usage
options extends [readdir-enhanced](https://github.com/JS-DevTools/readdir-enhanced)

Basic
```js
import readdir from "@jsdevtools/readdir-enhanced";

// Find all .txt files
readdir("my/directory", {filter: "*.txt"});

// Find all package.json files
readdir("my/directory", {filter: "**/package.json", deep: true});
```

### Extra Options
- formatFileName: function
- formatDirectoryName: function,
- outputFilePath: string,
- prefix: array,
- ignore: array

```js
const defaultOptions = {
  formatFileName,
  formatDirectoryName,
  deep: stats => ignoreNodeModules(stats, defaultOptions),
  filter: stats => myFilter(stats, defaultOptions),
  outputFilePath: 'list.md',
  prefix: ['.html'],
  ignore: ['node_modules', '.git', '.idea'],
}
```

### Example
```js
const {generateMdTree} = require('md-file-tree-enhanced')

generateMdTree('.', {
  outputFilePath: 'readme.md',
  prefix: ['.html', '.js'],
  ignore: ['node_modules', '.git', '.idea'],
  formatDirectoryName: (name)=>{
    return name+'1'+'\n'
  },
  formatFileName: (name, path)=>{
    return name+path+'\n'
  },
  // or
  // filter: myFilter,

}).then(({ output, files }) => {
  // console.log(res);
})
```


This generates the `list.md` file with:

```markdown
 - __CSS__
    - [IEMUSTGODIE.html](CSS/IEMUSTGODIE.html)
    - [Love Heart.js](CSS/Love Heart.js)
    - [WebpackIcon.html](CSS/WebpackIcon.html)
    - [border-arrow.html](CSS/border-arrow.html)
    - __box-shadow__
        - [box-shadow.html](CSS/box-shadow/box-shadow.html)
        - [aaa.js](CSS/box-shadow/aaa.js)
    - [linear-gradient.html](CSS/linear-gradient.html)
    - [photo-3d.html](CSS/photo-3d.html)
```
