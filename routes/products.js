var express = require('express');
var router = express.Router();
var fs = require("fs");
var pdata = require('./data/products.json');

/* GET particular product details with search*/
router.get('/products/:product_id', function(req, res, next) {
    let product_id = parseInt(req.params.product_id);
    if(Number.isInteger(product_id)){
        let resource = pdata.find(x => x.id==product_id);
        if(resource==undefined || resource==null){
            return res.status(404).json({});
        } else {
            return res.status(200).json(resource);
        }   
    } else {
        return res.status(400).json({ 'status':'failure', 'reason': 'Product id should be number only' });
    }     
});

/* Store product details here*/
router.post('/products', function(req, res, next) {
    let pdata = req.body;

    if(pdata.quantity>0){
        fs.readFile('./routes/data/products.json', 'utf-8', function(err, data) {
            if (err) {
                return res.status(400).json({'status':'failure', 'reason':'Not able to read products json file.'});
            }

            var arrayOfObjects = JSON.parse(data);
            var id = arrayOfObjects.length + 1;
            pdata.id = id;
            arrayOfObjects.push(pdata);
        
            fs.writeFile('./routes/data/products.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
                if (err) {
                    return res.status(400).json({'status':'failure', 'reason':'Not able to store the products data.'});
                }
                return res.status(201).json(pdata);
            })
        })
    } else {
        return res.status(416).json({'status':'failure', 'reason':'Quantity is must be greater than zero'});
    }
    
});

/* Delete particular product based on id*/
router.delete('/products/:product_id', function(req, res, next) {
    let product_id = parseInt(req.params.product_id);
    if(Number.isInteger(product_id)){
        fs.readFile('./routes/data/products.json', 'utf-8', function(err, data) {
            if (err) {
                return res.status(400).json({'status':'failure', 'reason':'Not able to read products json file.'});
            }

            var arrayOfObjects = JSON.parse(data);
            arrayOfObjects = arrayOfObjects.filter(function( obj ) {
                return obj.id !== product_id;
            });

            fs.writeFile('./routes/data/products.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
                if (err) {
                    return res.status(400).json({'status':'failure', 'reason':'Not able to delete the products data.'});
                }
                return res.status(200).json({'status':'success', 'message':'Sucessfully deleted the product.'});
            })
        })
    } else {
        return res.status(400).json({ 'status':'failure', 'reason': 'Product id should be number only' });
    }
});
module.exports = router;