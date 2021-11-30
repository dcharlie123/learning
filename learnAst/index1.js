const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default
const fs=require('fs')
const  generate =require('@babel/generator').default
let file=fs.readFileSync('./test.js','utf-8');
const ast = parser.parse(file);
traverse(ast,{
  VariableDeclaration(path,state){
    path.node.kind="abc"
  }
})
const transformedCode = generate(ast).code
fs.writeFile('test.js', transformedCode, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});