Just.use({
    rules:            {
        url:    "./json/rules.json",
        method: "GET",
        status: 409,
        list:   []
    },
    users:            {
        url:    "./json/users.json",
        method: "GET",
        status: 409,
        list:   []
    },
    fields:           {
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
    operators:        {
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
    },
    listA: ["A0", "A1", "A2", "A3", "A4"],
    listB: ["B0", "B1", "B2", "B3", "B4"],
    listC: ["C0", "C1", "C2", "C3", "C4"],
    listD: ["D0", "D1", "D2", "D3", "D4"]
});