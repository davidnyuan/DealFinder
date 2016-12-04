import dealObject from './dealObject.js';

var objectArray = [];

class DataController {
    grabData(query) {
        query = query.replace(" ", "%20");
        //sqoot
        fetch('http://api.sqoot.com/v2/deals?api_key=nBk_SmX1WbhznkZ44N96&online=true&query=' + query)

        .then((res) => {
            // return res.json();
            for (var i in res.deals) {
                if('key' in i === 'deal') {
                    objectArray.append(new dealObject('key'.title, 'key'.provider_name, 'key'.price, 'key'.discount_percentage, 'key'.value, 'key'.image_url, 'key'.url, 'key'.merchant.name.split(" ")[0]));
                    console.log("hi");
                    console.log('key'.title + " " + 'key'.provider_name + " " + 'key'.price+ " " + 'key'.discount_percentage+ " " + 'key'.value + " " +'key'.image_url+ " " + 'key'.url+ " " + 'key'.merchant.name.split(" ")[0]);
                }
            };
        });
        
        // })
        // .then((data) => {
        //     console.log(data.query.total);
        //     return data.query.total;
        // })
        // .then((res) => {
        //     result = res;
        //     console.log(result);
        // });


        //amazon

        // fetch('http://webservices.amazon.com/onca/xml?AWSAccessKeyId=AKIAJH52CXHDZPFFKDAA&AssociateTag=de032a-20&Keywords=' + query + '&Operation=ItemSearch&ResponseGroup=Offers&SearchIndex=All&Service=AWSECommerceService&Timestamp=' + expTimeStr + 'Z&Signature=zcfBqz853QbywCGQCcuPQ54CLgxthzp2VBJLbGStx3k%3D')
        // .then((res) => { //parse through xml file
        // })

        // return objectArray;
    }

    getDummy() {
        console.log("Dummy received");
        var dummyObject = [{
            itemName: 'item',
            companyName: 'company',
            currentPrice: 'currPrice',
            discountRate: 'discRate',
            originalPrice: 'origPrice',
            imageURL: 'defaultImg.png',
            websiteURL: 'https://www.google.com/',
            sellerCompany: 'company'
        }]
        return dummyObject;
    }
}

export default DataController