const algoliasearch = require('algoliasearch'),
      client = algoliasearch('NG3MLLL26O','9f227b0ef92a72688924775c7822fb87'),
      index = client.initIndex('offerkibaov1');

exports.products_search = function(req, res, next){
    if(!req.query.query){
        return res.status(401).json({
            success: false,
            message:"sorry! found errors on request"
        });
    }
    index.search({
        query: req.query.query,
        page: req.query.page,
    },
    (err,content)=>{
        res.status(200).json({
            success: true,
            content: content,
            search_result: req.query.query            
        });
    }
 );

}