"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const express = require("express");
const express_handlebars_1 = require("express-handlebars");
const helpers_1 = require("../templates/helpers");
const parser = (0, express_handlebars_1.create)({
    helpers: helpers_1.helpers
});
const startServer = (search_result, port = 3000) => {
    const app = express();
    app.engine('handlebars', parser.engine);
    app.set('view engine', 'handlebars');
    app.set('views', `${__dirname}/../templates/views`);
    app.use(express.static(`${__dirname}/static`));
    app.get('/', (req, res) => {
        res.render('results', {
            search_result
        });
    });
    app.listen(port, () => console.log(`App listening to port ${port}`));
};
exports.startServer = startServer;
//# sourceMappingURL=express.js.map