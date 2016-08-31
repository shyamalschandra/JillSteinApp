import botBuilder from 'botbuilder';
import intentBuilder from './intent-builder';

export default function (name, connector) {
    const GREETED_KEY = '__greeted';

    const intents = intentBuilder();
    const recognizers = [];

    let helpMessage;
    let helpHintMessage = 'Say what? Type "help" if you need...';
    let helpMessageHeader = 'Available commands are:';
    let greetingMessage = `Hi, here is ${name}! Type "help" and I will show you what I can do.`;

    const builder = {
        greeting(message) {
            greetingMessage = message;

            return builder;
        },
        help(message) {
            helpMessage = message;

            return builder;
        },
        helpHint(message) {
            helpHintMessage = message;

            return builder;
        },
        helpHeader(message) {
            helpMessageHeader = message;

            return builder;
        },
        recognizer(recognizer) {
            recognizers.push(recognizer);

            return builder;
        },
        build() {
            intents
                .begin(greetOnceAction)
                .default(helpHintMessage)
                .simpleText(/^help/i, buildHelpMessage());

            recognizers.forEach(recognizer => {
                intents.luisRecognizer(recognizer.recognizerModelUrl);
                recognizer.intents.forEach(intent => intents.recognizerIntentDialog(intent));
            });

            return new botBuilder.UniversalBot(connector).dialog('/', intents.build());
        }
    };

    return builder;

    function greetOnceAction(session) {
        if (!session.userData[GREETED_KEY]) {
            session.send(greetingMessage);
            session.userData[GREETED_KEY] = true;
        } else {
            session.send(helpHintMessage);
        }
    }

    function buildHelpMessage() {
        if (helpMessage) {
            return helpMessage;
        }

        const recognizersHelpMessages = recognizers.reduce((recognizerHelpMessages, recognizer) => {
            return recognizerHelpMessages.concat(extractHelpMessages(recognizer))
        }, []);

        return recognizersHelpMessages.length === 0 ?
            'no help available' :
            [helpMessageHeader].concat(recognizersHelpMessages).join('\n');

        function extractHelpMessages(recognizer) {
            return recognizer.intents
                .reduce((helpMessage, intent) => {
                    helpMessage.push(`  * ${intent.help}`);

                    return helpMessage;
                }, []);
        }
    }
}
