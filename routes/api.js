'use strict';

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function  (req, res){
      const {stock, like} = req.query
      if( typeof stock == 'string'){
        let stockData = await getStockData(stock) 
        res.send({"stockData":stockData})

      }else if(Array.isArray(stock)){
        let data1 = await getStockData(stock[0])
        let data2 = await getStockData(stock[1])
        data1.rel_likes = data1.likes - data2.likes
        data2.rel_likes = data2.likes - data1.likes
        delete data1.likes
        delete data2.likes
        res.send({"stockData":[data1 , data2]})
      }else{
        return res.status(400).json({ error: 'Invalid request' });
      }
    });
    
  };



const getStockData = async (symbol)=>{
  let result = {}
  await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`)
  .then(res => res.json())
  .then(data=>{
    result.stock = data.symbol
    result.price = data.latestPrice
    result.likes = 1
  })
  .catch(e=> console.log(e))

  return result
}