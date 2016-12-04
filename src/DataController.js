import dealObject from './dealObject.js';

var objectArray = [];

class DataController {
    grabData(query) {
        query = query.replace(" ", "%20");
        //sqoot
        fetch('http://api.sqoot.com/v2/deals?api_key=nBk_SmX1WbhznkZ44N96&online=true&query=' + query)
            .then((res) => {
                res = JSON.parse(res);
                for (var i in res.deals) {
                    if ('key' in i === 'deal') {
                        objectArray.append(dealObject('key'.title, 'key'.provider_name, 'key'.price, 'key'.discount_percentage, 'key'.value, 'key'.image_url, 'key'.url, 'key'.merchant.name.split(" ")[0]));
                    }
                };
            })
        //amazon

        var expTime = new Date(+new Date());
        var m = expTime.getMonth() + 1;
        var d = expTime.getDate();
        var y = expTime.getFullYear();
        var h = expTime.getHours();
        var i = expTime.getMinutes();
        var s = expTime.getSeconds();
        var expTimeStr = y +"-"+ m +"-"+ d +" "+ h +":"+ i +":"+ s;
        // fetch('http://webservices.amazon.com/onca/xml?AWSAccessKeyId=AKIAJH52CXHDZPFFKDAA&AssociateTag=de032a-20&Keywords=' + query + '&Operation=ItemSearch&ResponseGroup=Offers&SearchIndex=All&Service=AWSECommerceService&Timestamp=' + expTimeStr + 'Z&Signature=zcfBqz853QbywCGQCcuPQ54CLgxthzp2VBJLbGStx3k%3D')
        // .then((res) => { //parse through xml file
        // })

        return objectArray;
    }

    getDummy() {
        console.log("Dummy received");
    }
}

export default DataController