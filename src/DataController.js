import dealObject from './dealObject.js';
import jQuery from '//ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js';

var objectArray = [];

class DataController {
    grabData(query) {
        query = query.replace(" ", "%20");
        //sqoot
        $.getJSON('http://api.sqoot.com/v2/deals?api_key=nBk_SmX1WbhznkZ44N96&online=true&query=' + query)
        .then((res) => {
            for (var i in res.deals) {
                if('key' in i === 'deal') {
                    objectArray.append(dealObject(deal.title, deal.provider_name, deal.price, deal.discount_percentage, deal.value, deal.image_url, deal.url, deal.merchant.name.split(" ")[0]));
                }
            };
        })
        //amazon
        // fetch('http://webservices.amazon.com/onca/xml?AWSAccessKeyId=AKIAJH52CXHDZPFFKDAA&AssociateTag=de032a-20&Keywords=' + query + '&Operation=ItemSearch&ResponseGroup=Offers&SearchIndex=All&Service=AWSECommerceService&Timestamp=2016-12-04T01%3A46%3A14.000Z&Signature=QNbC91Vmgl6sNIpQr71Stt%2B6JCHzkFCYf4N3Czsql%2FY%3D')
        // .then((res) => { //parse through xml file
        // })

        return objectArray;
    }

    getDummy() {
        console.log("Dummy received");
    }
}

export default DataController