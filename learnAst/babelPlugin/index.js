module.exports = (api, options, dirname) => {
  return {
    visitor: {
      FunctionDeclaration(path, state) {
        let pathBody=path.get('body')
        if(path.node.leadingComments){
          const leadingComments = path.node.leadingComments.filter(comment => /\@inject:(\w+)/.test(comment.value) )
          leadingComments.forEach((comment)=>{
            const injectTypeMatch
          })
        }
      }
    }
  }
}