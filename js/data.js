Just.use({
    rules:     [{
        id:     "highest-speed-internet",
        groups: [{
            sort:    [
                {key: "internet.downloadSpeed", dir: -1},
                {key: "longTermPrice.amount", dir: -1},
                {key: "longTermPrice.amount", dir: 1}
            ],
            include: [{
                "longTermPrice.amount": {isMoreOr: 10, isnt: 5, isLessOr: 100},
                provider:               {is: "foobar"}
            }],
            limit:   1,
            skip:    0
        }]
    }, {
        id:     "highest-speed-triple-play",
        groups: [{
            sort:    [
                {key: "internet.downloadSpeed", dir: -1},
                {key: "longTermPrice.amount", dir: 1}
            ],
            include: [
                {isTriplePlay: {isnt: false}}
            ],
            limit:   1,
            skip:    0
        }]
    }, {
        id:     "lowest-price-internet",
        groups: [{
            sort:    [
                {key: "longTermPrice.amount", dir: 1},
                {key: "internet.downloadSpeed", dir: -1}
            ],
            include: [{isInternet: {is: true}}],
            limit:   1,
            skip:    0
        }]
    }, {
        id:     "lowest-price-triple-play",
        groups: [{
            sort:    [
                {key: "longTermPrice.amount", dir: 1},
                {key: "internet.downloadSpeed", dir: -1}
            ],
            include: [{isTriplePlay: {is: true}}],
            limit:   1,
            skip:    0
        }]
    }],
    fields:    {
        "isInternet":             {
            filterBy: true,
            sortBy:   false,
            kind:     Boolean,
            label:    "Is Internet"
        },
        "isTriplePlay":           {
            filterBy: true,
            sortBy:   false,
            kind:     Boolean,
            label:    "Is Triple-Play"
        },
        "longTermPrice.amount":   {
            sortBy:   true,
            filterBy: true,
            kind:     Number,
            label:    "Price"
        },
        "internet.downloadSpeed": {
            sortBy:   true,
            filterBy: true,
            kind:     Number,
            label:    "Download Speed"
        },
        "provider":               {
            sortBy:   true,
            filterBy: true,
            kind:     String,
            label:    "Provider Name"
        }
    },
    operators: {
        is:        {
            label:  "is equal to",
            fields: ["isInternet", "isTriplePlay", "longTermPrice.amount", "internet.downloadSpeed", "provider"]
        },
        isnt:      {
            label:  "is not equal to",
            fields: ["isInternet", "isTriplePlay", "longTermPrice.amount", "internet.downloadSpeed", "provider"]
        },
        isMoreOr:  {
            label:  "is more or equal to",
            fields: ["longTermPrice.amount", "internet.downloadSpeed"]
        },
        isLessOr:  {
            label:  "is less or equal to",
            fields: ["longTermPrice.amount", "internet.downloadSpeed"]
        },
        hasPrefix: {
            label:  "starts with",
            fields: ["provider"]
        }
    }
});