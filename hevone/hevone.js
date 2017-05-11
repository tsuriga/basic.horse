/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  MIT License
 *
 *  Copyright (c) 2016-2017 Olli Suoranta (http://basic.horse)
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
 *  "Hevone" Telegram Bot by basic.horse
 *
 *  See README.md for usage instructions.
 *
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

const process = require('process');
const Telegraf = require('telegraf');

const config = require('./config.js');
const func = require('./func.js');

const bot = new Telegraf(config.apikey);

let isInitialized = false;
let isReminderSaveDone = false;

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

/* Ask if you should something */
bot.command(['ask', 'ask@hevone_bot'], (ctx) => {
    ctx.reply(func.ask());
})

/* Random gif */
bot.command(['gif', 'gif@hevone_bot'], (ctx) => {
    func.getGif(ctx);
})

/* Truths from the jungle */
bot.command(['mustanaamio', 'mustanaamio@hevone_bot'], (ctx) => {
    ctx.reply(func.mustanaamio());
})

/* Reminder service */
bot.command(['remind', 'remind@hevone_bot'], (ctx) => {
    func.remind(ctx);
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

/* Posts Skull Trumpet video if hears something related to skeletons */
bot.hears(/value for life/i, (ctx) => {
    ctx.reply("VALUE FOR SOCIETY!");
})

/* Load and save timers on start and exit respectively */

if (!func.loadReminders(bot)) {
    process.exit(1);
}

const quitBot = () => {
    if (!isReminderSaveDone) {
        func.saveReminders();
        isReminderSaveDone = true;
    }

    process.exit(0);
}
process.on('exit', quitBot);
process.on('SIGTERM', quitBot);
process.on('SIGINT', quitBot);
process.on('SIGHUP', quitBot);

bot.startPolling();
