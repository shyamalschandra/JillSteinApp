import botBuilder from 'botbuilder';

export default function (botFactory) {
    return botFactory(new botBuilder.ConsoleConnector().listen());
}
