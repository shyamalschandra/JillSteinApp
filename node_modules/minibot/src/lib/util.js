import botBuilder from 'botbuilder';

export function asAction(actionOrMessage) {
    return typeof actionOrMessage === 'string' ? botBuilder.DialogAction.send(actionOrMessage) : actionOrMessage;
}
