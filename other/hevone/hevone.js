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
 *  "Hevone" v.0.3 Telegram Bot by basic.horse
 *  (This bot doesn't need any kind of access to messages and thus don't store anything)
 *
 *  SETUP
 *      - Install dependencies (npm install <>):
 *          - NodeJS (https://github.com/nodejs/node)
 *          - Telegraf (https://github.com/telegraf/telegraf)
 *      - Add the API Token from your Telegram Bot into func.js file.
 *      - Check that func.js is in the same folder as this file.
 *
 *  USAGE
 *      - Launch the bot with "nodejs hevone.js"
 *      - Get list of commands by saying "/about" to the bot.
 *
 *  All set!
 *
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

const Telegraf = require('telegraf')
const bot = new Telegraf("325363173:AAE2SH6N7OyCJeNYIzvflohYs-ZbmLh9aAs")

var func = require('./func.js');

/* -- Commands -- */

/* Prints about text and command list */
bot.command(['about', 'about@hevone_bot'], (ctx) => {
    ctx.reply(func.about() + "\n" + func.features());
})

/* Throw dice 0-6 */
bot.command(['dice', 'dice@hevone_bot'], (ctx) => {
    ctx.reply(Math.floor(Math.random() * 7) + " " + func.emoticon());
})

/* Four pizza toppings */
bot.command(['pizza', 'pizza@hevone_bot'], (ctx) => {
    ctx.reply(
        func.pizzaTopping() + ", " + func.pizzaTopping() + ", " +
        func.pizzaTopping() + " and " + func.pizzaTopping() + " " + func.emoticon()
    );
})

/* Random beverage */
bot.command(['beverage', 'beverage@hevone_bot'], (ctx) => {
    ctx.reply(func.fill() + " try " + func.drink() + " " + func.emoticon());
})

/* Random food */
bot.command(['food', 'food@hevone_bot'], (ctx) => {
    ctx.reply(func.food() + " " + func.emoticon());
})

/* Mixes a random drink */
bot.command(['drink', 'drink@hevone_bot'], (ctx) => {
    ctx.reply("combine " + func.drink() + " and " + func.drink() + " " + func.emoticon());
})

/* Gets random movie with poster */
bot.command(['movie', 'movie@hevone_bot'], (ctx) => {
    func.getMovie(ctx);
})

/* Says random quote */
bot.command(['quote', 'quote@hevone_bot'], (ctx) => {
    func.getQuote(ctx);
})

/* Random cat fact and image */
bot.command(['cat', 'cat@hevone_bot'], (ctx) => {
    func.getCatFact(ctx);
    func.getCatImage(ctx);
})

/* Random Chuck Norris fact/joke */
bot.command(['norris', 'norris@hevone_bot'], (ctx) => {
    func.getChuckNorrisQuote(ctx);
})

/* Random gif */
bot.command(['gif', 'gif@hevone_bot'], (ctx) => {
    func.getGif(ctx);
})

/* -- Hears without mention -- */

/* Posts Skull Trumpet video if hears something related to skeletons */
bot.hears(/skelet|skull|spooky|spoopy/i, (ctx) => {
    ctx.reply("https://www.youtube.com/watch?v=eVrYbKBrI7o");
})

/* Informs about YouTube link containing timestamp */
bot.hears(/.*\?t=.*/i, (ctx) => {
    ctx.reply("Link contains timestamp!");
})

/* -- Hears bot name mentioned -- */

/* Talks random things by using func */
bot.hears(/(?:hevone|horse).*|.*(?:hevone|horse)/i, (ctx) => {
    var story = Math.floor(Math.random() * 11);

    if (story == 0) ctx.reply("You seem " + func.adjective());
    if (story == 1) ctx.reply("Could we talk about " + func.subject());
    if (story == 2) ctx.reply("I am hungry, I think I will get some " + func.food());
    if (story == 3) ctx.reply("I wonder if you guys think I am " + func.adjective());
    if (story == 4) ctx.reply(func.pastTense() + " I ate " + func.food() + " and took some " + func.drink());
    if (story == 5) ctx.reply(func.subject() + " is interesting " + func.futureTense());
    if (story == 6) ctx.reply("I really like to " + func.verb());
    if (story == 7) ctx.reply("I have commands you know, type /about dude!");
    if (story == 8) ctx.reply("I really need a new " + func.object() + " " + func.emoticon());
    if (story == 9) ctx.reply("You guys should eat some " + func.food() + " today " + func.emoticon());
    if (story == 10) ctx.reply(func.pastTense() + " I broke my " + func.object());
})

bot.startPolling();