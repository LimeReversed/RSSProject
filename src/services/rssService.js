class RSSObject {
  constructor(title, link, articleId, pubDate, description, imageURL) {
    this.title = title;
    this.link = link;
    this.articleId = articleId;
    this.pubDate = new Date(pubDate);
    this.description = description;
    this.imageURL = imageURL;
  }
}

export class RssList {
  #rssSources;
  #intervalFunction;
  #interval = 10000;
  rssObjects = [];

  constructor(rssSources) {
    this.init(rssSources).then(() => {
      this.#startNewInterval();
    });
  }

  #getStream = (reader) => {
    return new ReadableStream({
      start(controller) {
        // The following function handles each data chunk
        function push() {
          // "done" is a Boolean and value a "Uint8Array"
          reader.read().then(({ done, value }) => {
            // If there is no more data to read
            if (done) {
              controller.close();
              return;
            }
            // Get the data and send it to the browser via the controller
            controller.enqueue(value);
            push();
          });
        }

        push();
      },
    });
  };

  #getXmlFromUrl = async (url) => {
    const fetchResult = await fetch(url);
    const reader = fetchResult.body.getReader();
    const stream = await this.#getStream(reader);
    const streamResponse = await new Response(stream, {
      headers: { "Content-Type": "text/xml" },
    }).text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(streamResponse, "text/xml");
    const itemList = xmlDoc.getElementsByTagName("item");
    return itemList;
  };

  #getXmlFromMultipleUrls = async (urlList) => {
    let result = [];

    for (let i = 0; i < urlList.length; i++) {
      let newItems = await this.#getXmlFromUrl(urlList[i]);
      result = [...result, ...newItems];
    }

    return result;
  };

  #parseToRssObject = (itemElement) => {
    let title = null;
    let link = null;
    let articleId = null;
    let pubDate = null;
    let description = null;
    let imageURL = null;

    for (let i = 0; i < itemElement.children.length; i++) {
      if (itemElement.children[i].tagName == "title") {
        title = itemElement.children[i].textContent;
      } else if (itemElement.children[i].tagName == "link") {
        link = itemElement.children[i].textContent;
      } else if (itemElement.children[i].tagName == "guid") {
        articleId = itemElement.children[i].textContent;
      } else if (itemElement.children[i].tagName == "pubDate") {
        pubDate = itemElement.children[i].textContent;
      } else if (itemElement.children[i].tagName == "description") {
        description = itemElement.children[i].textContent;
      } else if (itemElement.children[i].tagName == "enclosure") {
        imageURL = itemElement.children[i].attributes.url;
      }
    }

    return new RSSObject(
      title,
      link,
      articleId,
      pubDate,
      description,
      imageURL
    );
  };

  init = async (rssSources) => {
    console.log("Reached init");
    this.#rssSources = rssSources;
    let allXmlElements = await this.#getXmlFromMultipleUrls(rssSources);
    let allRssObjects = [];
    allXmlElements.forEach((el) => {
      allRssObjects.push(this.#parseToRssObject(el));
    });

    this.rssObjects = allRssObjects;
  };

  #startNewInterval = () => {
    clearInterval(this.#intervalFunction);
    this.#intervalFunction = setInterval(() => {
      this.init(this.#rssSources);
    }, this.#interval);
  };

  sortByTitle = () => {
    this.rssObjects.sort((a, b) => {
      return a.title > b.title;
    });
  };

  sortByDate = () => {
    this.rssObjects.sort((a, b) => {
      return a.pubDate < b.pubDate;
    });
  };

  #createZursUrl = (url) => {
    let encodedLink = window.btoa(url);
    return `https://getrss.zurs.se/?url=${encodedLink}`;
  };

  add = async () => {
    var url = prompt("Enter Rss URL");
    if (url != null) {
      let zursUrl = this.#createZursUrl(url);
      this.#rssSources.push(zursUrl);
      document.cookie = `rssSources=${JSON.stringify(this.#rssSources)}`;
      this.init(this.#rssSources);
      this.#startNewInterval();
    }
  };

  remove = async (index) => {
    this.rssSources.splice(index, 1);
    document.cookie = `rssSources=${JSON.stringify(this.rssSources)}`;
    this.init(this.#rssSources);
    this.#startNewInterval();
  };

  #extractLinkFromZursUrl = (link) => {
    let encodedPartOfLink = link.substring(28);
    let decoded = window.atob(encodedPartOfLink);
    return decoded;
  };

  getAddedUrls = () => {
    return this.#rssSources.map((el) => this.#extractLinkFromZursUrl(el));
  };
}

export const extractLinkFromZursUrl = (link) => {
  let encodedPartOfLink = link.substring(28);
  let decoded = window.atob(encodedPartOfLink);
  return decoded;
};

export const listAddedUrls = (list) => {
  return list.map((el) => extractLinkFromZursUrl(el));
};

export const parseToRSSObject = (itemElement) => {
  let title = null;
  let link = null;
  let articleId = null;
  let pubDate = null;
  let description = null;
  let imageURL = null;

  for (let i = 0; i < itemElement.children.length; i++) {
    if (itemElement.children[i].tagName == "title") {
      title = itemElement.children[i].textContent;
    } else if (itemElement.children[i].tagName == "link") {
      link = itemElement.children[i].textContent;
    } else if (itemElement.children[i].tagName == "guid") {
      articleId = itemElement.children[i].textContent;
    } else if (itemElement.children[i].tagName == "pubDate") {
      pubDate = itemElement.children[i].textContent;
    } else if (itemElement.children[i].tagName == "description") {
      description = itemElement.children[i].textContent;
    } else if (itemElement.children[i].tagName == "enclosure") {
      imageURL = itemElement.children[i].attributes.url;
    }
  }

  return new RSSObject(title, link, articleId, pubDate, description, imageURL);
};

const getStream = (reader) => {
  return new ReadableStream({
    start(controller) {
      // The following function handles each data chunk
      function push() {
        // "done" is a Boolean and value a "Uint8Array"
        reader.read().then(({ done, value }) => {
          // If there is no more data to read
          if (done) {
            console.log("done", done);
            controller.close();
            return;
          }
          // Get the data and send it to the browser via the controller
          controller.enqueue(value);
          // Check chunks by logging to the console
          console.log(done, value);
          push();
        });
      }

      push();
    },
  });
};

export const getItemElements = async (url) => {
  const fetchResult = await fetch(url);
  const reader = fetchResult.body.getReader();
  const stream = await getStream(reader);
  const streamResponse = await new Response(stream, {
    headers: { "Content-Type": "text/xml" },
  }).text();

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(streamResponse, "text/xml");
  const itemList = xmlDoc.getElementsByTagName("item");
  return itemList;
};

export const getAllItemElements = async (rssSources) => {
  let result = [];

  for (let i = 0; i < rssSources.length; i++) {
    let newItems = await getItemElements(rssSources[i]);
    result = [...result, ...newItems];
  }

  return result;
};

export const getAllRssObjects = async (rssSources) => {
  let allItemElements = await getAllItemElements(rssSources);
  let allRssObjects = [];
  allItemElements.forEach((el) => {
    allRssObjects.push(parseToRSSObject(el));
  });

  return allRssObjects;
};
