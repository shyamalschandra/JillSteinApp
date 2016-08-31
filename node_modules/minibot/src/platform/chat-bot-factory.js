import botBuilder from 'botbuilder';
import restify from 'restify';

export default function (botFactory) {
    const PORT = process.env.port || process.env.PORT || 3978;

    const connector = new botBuilder.ChatConnector({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    });

    const server = restify.createServer();
    server.listen(PORT, () => console.log(`${server.name} listening to ${server.url}`));
    server.post('/api/messages', connector.listen());

    return botFactory(connector);
}
