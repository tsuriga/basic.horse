/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  MIT License
 *
 *  Copyright (c) 2016 Olli Suoranta (http://basic.horse)
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 *
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  This file contains functions and dictionary for hevone_bot to use.
 */

var http = require('http');
var util = require('util');

var getRandomFromArray = function(array) {
    return array[Math.floor(Math.random() * array.length)]
};

module.exports = {
    features: function () {
        return Array.from([
            "List of features (usage: /<command>): ",
            "/about: About this bot",
            "/dice: Throw dice (0-6)",
            "/pizza: Random Pizza toppings",
            "/beverage: Random beverage",
            "/food: Random food",
            "/drink: Mixes a drink",
            "/movie: Random movie",
            "/quote: Random quote",
            "/cat: Random cat fact with image",
            "/norris: Random Chuck Norris joke",
            "/gif: Random gif",
        ]).join("\n");
    },

    about: function () {
        return "_/°°¬ -hevone_bot v.0.3 by basic.horse";
    },

    subject: function () {
        return getRandomFromArray([
            "computer science", "politics", "insanity", "careers", "education", "culture", "pop-culture",
            "movies", "games", "handheld games", "programming languages", "php", "nodejs", "rust", "golang",
            "python", "C", "C++", "Pascal", "TurboPascal", "Ruby", "sailing", "boats", "cars", "motorbikes",
            "shopping", "state of tv", "war", "art", "collecting", "cleaning", "drama", "comedy", "nature",
            "sexuality", "identity crisis", "existence", "space", "religion", "engineering", "science", "physics",
            "mathematics", "electricity", "knitting", "clothing", "cooking", "food", "wine", "soft drinks"
        ]);
    },

    object: function () {
        return getRandomFromArray([
            "ball", "table", "guitar", "bass guitar", "drums", "computer", "gaming console",
            "tree", "bench", "ticket", "car", "motorbike", "bike", "jacket", "pants", "panties",
            "shirt", "fridge", "toilet", "keyboard", "dishwasher", "amp", "mixer", "drink machine",
            "mouse", "pen"
        ]);
    },

    drink: function () {
        return getRandomFromArray([
            "whiskey", "beer", "vodka", "milk", "water", "coke", "sprite", "fanta", "kilju", "cider",
            "cognac", "liqueur", "milkshake", "sake", "salmiakkikossu", "toffee liqueur", "long drink",
            "jäger", "energy drink", "zero coke", "dr.pepper"
        ]);
    },

    food: function () {
        return getRandomFromArray([
            "pizza", "lasagne", "hamburger", "iskender", "kebab", "macaroni and cheese", "pea soup",
            "bread", "hot wings", "fish soup", "meat pie", "sausage", "grilled cheese", "pasties",
            "meatpie", "fish sticks", "chocolate cake", "steak", "panini", "rice and chicken",
            "meatballs and mash", "hot dog", "mämmi", "sushi"
        ]);
    },

    pizzaTopping: function () {
        return getRandomFromArray([
            "blue cheese", "pepperoni", "aspargus", "chili", "kebab", "mozzarella", "onion", "bacon",
            "olive", "shrimps", "ham", "turtle dicks", "chicken", "beef", "shells", "cheese",
            "egg", "feta", "salami", "aragula", "tomato", "tuna", "ananas", "mushroom",
            "jalapeno", "peach", "paprika", "goat cheese", "basilica", "corn", "peas", "garlic",
            "BBQ", "sour cream", "taco mayonnaise"
        ]);
    },

    adjective: function () {
        return getRandomFromArray([
            "beautiful", "intense", "smart", "funny", "stupid", "disturbing", "offensive", "faschinating",
            "exhausting", "handsome", "intelligent", "artistic", "sexy", "legit", "cumbersome", "talented",
            "educated", "used", "intellectual", "musical", "wise", "energetic", "wasted", "drunk"
        ]);
    },

    verb: function () {
        return getRandomFromArray([
            "fight", "code", "drink", "eat", "sleep", "jog", "paint", "take a shit", "play", "wonder",
            "dream", "snore", "watch", "buy something", "sell something", "operate", "love", "hate", "adjust",
            "walk naked", "buy tickets", "park a car", "have an awakening", "concentrate on school",
            "pay bills", "take a walk", "bake some bread", "evacuate this building", "have a bbq party",
            "watch sad movies", "watch happy movies", "change the strings for my bass", "buy ink for my printer",
            "talk to strangers", "go talk with other dog walkers", "improve myself", "clean this mess",
            "teach my master to code", "annoy the neightbors", "take out the trash", "change the lightbulb",
            "watch the angry face of Linus", "install gentoo", "learn freebsd", "bounty", "stare at the wall",
            "reason myself to buy a boat", "comfort my friend", "buy useless stuff", "be so damn negative",
            "be so damn positive", "wish for a wish crisp", "eat some cresps", "play ukulele", "ride to the sunset",
            "loop around three web pages", "watch news that i have already seen", "play my console",
            "type angry comments", "spread positive energy", "inform the others about my opinion",
            "whine about useless things", "learn the anatomy of humans", "build something unnecessary"
        ]);
    },

    pastTense: function () {
        return getRandomFromArray([
            "now", "yesterday", "couple days ago", "last week", "last month", "last year", "couple years ago"
        ]);
    },

    futureTense: function () {
        return getRandomFromArray([
            "now", "tomorrow", "next week", "after couple days", "next month", "next year", "after couple years"
        ]);
    },

    curse: function () {
        return getRandomFromArray([
            "shit", "crap", "hell"
        ]);
    },

    fill: function () {
        return getRandomFromArray([
            "well", "uh", "umm"
        ]);
    },

    emoticon: function () {
        return getRandomFromArray([
            ":)", ":|", ":(", ":/", ":P", ";)", ":O"
        ]);
    },

    /* Prints quote from api.forismatic.com api */
    getQuote: function(ctx) {
        var options = {
            host: 'api.forismatic.com',
            path: '/api/1.0/?method=getQuote&format=json&lang=en',
        };

        callback = function(response) {
            var str = '';

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                var quotesRemoved = str.replace(/\\'/g, "");
                var object = JSON.parse(quotesRemoved);

                var quoteAuthor = (object.quoteAuthor === "") ? "Unknown" : object.quoteAuthor ;
                var quoteText = util.format('"%s" -%s', object.quoteText, quoteAuthor);

                ctx.reply(quoteText);
            });
        }

        http.request(options, callback).end();
    },

    /* Prints random movie from random-movie.herokuapp.com api with poster included */
    getMovie: function(ctx) {
        var options = {
            host: 'random-movie.herokuapp.com',
            path: '/random'
        };

        callback = function(response) {
            var str = '';

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                var object = JSON.parse(str);
                ctx.reply(object.Title + ", done in " + object.Year + " " + object.Poster);
            });
        }

        http.request(options, callback).end();
    },

    /* Prints random cat image from thecatapi.com api */
    getCatImage: function(ctx) {
        var options = {
            host: 'thecatapi.com',
            path: '/api/images/get'
        };

        callback = function(response) {
            ctx.reply(response.headers.location);
        }

        http.request(options, callback).end();
    },

    /* Prints random cat fact from catfacts-api.appspot.com api */
    getCatFact: function(ctx) {
        var options = {
            host: 'catfacts-api.appspot.com',
            path: '/api/facts'
        };

        callback = function(response) {
            var str = '';

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                var object = JSON.parse(str);
                ctx.reply(object.facts[0]);
            });
        };

        http.request(options, callback).end();
    },

    /* Prints Chuck Norris joke from api.icndb.com api */
    getChuckNorrisQuote: function(ctx) {
        var options = {
            host: 'api.icndb.com',
            path: '/jokes/random',
        };

        callback = function(response) {
            var str = '';

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                var object = JSON.parse(str);

                ctx.reply(object.value.joke);
            });
        }

        http.request(options, callback).end();
    },

    /* Gets random gif from api.giphy.com api */
    getGif: function(ctx) {
        var options = {
            host: 'api.giphy.com',
            path: '/v1/gifs/random?api_key=dc6zaTOxFJmzC'
        };

        callback = function(response) {
            var str = '';

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                var object = JSON.parse(str);
                ctx.reply(object.data.image_url);
            });
        }

        http.request(options, callback).end();
    }
};
