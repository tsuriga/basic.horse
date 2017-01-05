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

module.exports = {
    features: function () {
        return "List of features (usage: /<command>): \n/about: About this bot\n/dice: Throw dice (0-6)\n/pizza: Random Pizza toppings\n/beverage: Random beverage\n/food: Random food\n/drink: Mixes a drink \n/movie: Random movie\n/quote: Random quote\n/cat: Random cat fact with image\n/norris: Random Chuck Norris joke\n/gif: Random gif\n";
    },

    about: function () {
        return "_/°°¬ -hevone_bot v.0.3 by basic.horse";
    },

    subject: function () {
        var subjects = [
            "computer science", "politics", "insanity", "careers", "education", "culture", "pop-culture",
            "movies", "games", "handheld games", "programming languages", "php", "nodejs", "rust", "golang",
            "python", "C", "C++", "Pascal", "TurboPascal", "Ruby", "sailing", "boats", "cars", "motorbikes",
            "shopping", "state of tv", "war", "art", "collecting", "cleaning", "drama", "comedy", "nature",
            "sexuality", "identity crisis", "existence", "space", "religion", "engineering", "science", "physics",
            "mathematics", "electricity", "knitting", "clothing", "cooking", "food", "wine", "soft drinks"
        ];

        return subjects[Math.floor(Math.random() * subjects.length)];
    },

    object: function () {
        var objects = [
            "ball", "table", "guitar", "bass guitar", "drums", "computer", "gaming console",
            "tree", "bench", "ticket", "car", "motorbike", "bike", "jacket", "pants", "panties",
            "shirt", "fridge", "toilet", "keyboard", "dishwasher", "amp", "mixer", "drink machine",
            "mouse", "pen"
        ];

        return objects[Math.floor(Math.random() * objects.length)];
    },

    drink: function () {
        var drinks = [
            "whiskey", "beer", "vodka", "milk", "water", "coke", "sprite", "fanta", "kilju", "cider",
            "cognac", "liqueur", "milkshake", "sake", "salmiakkikossu", "toffee liqueur", "long drink",
            "jäger", "energy drink", "zero coke", "dr.pepper"
        ];

        return drinks[Math.floor(Math.random() * drinks.length)];
    },

    food: function () {
        var foods = [
            "pizza", "lasagne", "hamburger", "iskender", "kebab", "macaroni and cheese", "pea soup",
            "bread", "hot wings", "fish soup", "meat pie", "sausage", "grilled cheese", "pasties",
            "meatpie", "fish sticks", "chocolate cake", "steak", "panini", "rice and chicken",
            "meatballs and mash", "hot dog", "mämmi", "sushi"
        ];

        return foods[Math.floor(Math.random() * foods.length)];
    },

    pizzaTopping: function () {
        var pizzaToppings = [
            "blue cheese", "pepperoni", "aspargus", "chili", "kebab", "mozzarella", "onion", "bacon",
            "olive", "shrimps", "ham", "turtle dicks", "chicken", "beef", "shells", "cheese",
            "egg", "feta", "salami", "aragula", "tomato", "tuna", "ananas", "mushroom",
            "jalapeno", "peach", "paprika", "goat cheese", "basilica", "corn", "peas", "garlic",
            "BBQ", "sour cream", "taco mayonnaise"
        ];

        return pizzaToppings[Math.floor(Math.random() * pizzaToppings.length)];
    },

    adjective: function () {
        var adjectives = [
            "beautiful", "intense", "smart", "funny", "stupid", "disturbing", "offensive", "faschinating",
            "exhausting", "handsome", "intelligent", "artistic", "sexy", "legit", "cumbersome", "talented"
        ];

        return adjectives[Math.floor(Math.random() * adjectives.length)];
    },

    verb: function () {
        var verbs = [
            "fight", "code", "drink", "eat", "sleep", "jog", "paint", "take a shit", "play", "wonder",
            "dream", "snore", "watch", "buy", "sell", "imitate", "operate", "love", "hate", "adjust"
        ];

        return verbs[Math.floor(Math.random() * verbs.length)];
    },

    pastTense: function () {
        var pastTenses = [
            "yesterday", "couple days ago", "last week", "last month", "last year", "couple years ago"
        ];

        return pastTenses[Math.floor(Math.random() * pastTenses.length)];
    },

    futureTense: function () {
        var futureTenses = [
            "tomorrow", "next week", "after couple days", "next month", "next year", "after couple years"
        ];

        return futureTenses[Math.floor(Math.random() * futureTenses.length)];
    },

    curse: function () {
        var curses = [
            "shit", "crap", "hell"
        ];

        return curses[Math.floor(Math.random() * curses.length)];
    },

    fill: function () {
        var fills = [
            "well", "uh", "umm"
        ];

        return fills[Math.floor(Math.random() * fills.length)];
    },

    emoticon: function () {
        var emoticons = [
            ":)", ":|", ":(", ":/", ":P", ";)", ":O"
        ];

        return emoticons[Math.floor(Math.random() * emoticons.length)];
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
                ctx.reply("kato " + object.Title + ", se on tehty " + object.Year);
                ctx.reply(object.Poster);
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