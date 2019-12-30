import { getDetails } from '../services/PageDetailsService';

const extractMentions = message => {
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let matchedContent;

  while ((matchedContent = mentionRegex.exec(message))) {
    mentions.push(matchedContent[1]);
  }

  return mentions;
};

const extractEmoticons = message => {
  const emoticonsRegex = /\(([ -~]{0,15})\)/g;
  const emoticons = [];
  let matchedContent;

  while ((matchedContent = emoticonsRegex.exec(message))) {
    emoticons.push(matchedContent[1]);
  }

  return emoticons;
};

const extractLinks = async message => {
  const linksRegex = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g;
  const links = [];
  let matchedContent;

  while ((matchedContent = linksRegex.exec(message))) {
    const urlFound = matchedContent[1];
    const { title } = await getDetails(urlFound);
    if (title) {
      links.push({ url: urlFound, title });
    }
  }

  return links;
};

export default async function evaluate(message) {
  const mentions = extractMentions(message);
  const emoticons = extractEmoticons(message);
  const links = await extractLinks(message);

  return {
    mentions,
    emoticons,
    links,
  };
}
