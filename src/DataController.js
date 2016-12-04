class DataController {
    grabData(query) {
        fetch('http://api.sqoot.com/v2/deals?api_key=nBk_SmX1WbhznkZ44N96&online=true&query=headphones')
        .then((res) => {
            return res.json();
        })
        .then(() => {

        })
    }
}

export default DataController