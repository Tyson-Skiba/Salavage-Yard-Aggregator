import * as express from 'express';
import { create } from 'express-handlebars';

import { IListing } from '../data-sources';
import { helpers } from '../templates/helpers';

const parser = create({
    helpers
});

export const startServer = (search_result: IListing[], port = 3000) => {
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
}
