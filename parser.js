const getData = async() => {
  return await fetch('./data.json')
  .then((response) => {
    if (response.status === 200) {
      return response.json()
    } else {
      Promise.reject('Content error')
      document.querySelector('#status').innerText = 'Content error'
    }
  })
  .catch((error) => {
    Promise.reject('Network error')
    document.querySelector('#status').innerText = 'Network error'
  })
}

const populateTimeline = async(data) => {
  document.querySelector('#status').innerText = ''//JSON.stringify(data)
  
  const root = document.querySelector('.main-timeline-2')
  let iter = 0
  for (i of data) {
    const direction = iter % 2 ? 'left' : 'right'

    const element = document.createElement('div')
    element.classList.add('timeline-2', `${direction}-2`)

    const card = document.createElement('div')
    card.classList.add('card')
    card.id = iter
    
    const image = document.createElement('img')
    image.classList.add('card-img-top')
    image.alt = i["title"]
    image.src = i["image"]

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body', 'p-3')

    const title = document.createElement('h4')
    title.classList.add('fw-bold')
    title.innerText = i["title"]

    const date = document.createElement('p')
    date.classList.add('text-muted')
    date.innerText = formatYear(i["year"])

    const content = document.createElement('div')
    content.classList.add('card-body', 'p-1')

    const descriptionLabel = document.createElement('h5')
    descriptionLabel.innerText = 'Description'

    const description = document.createElement('p')
    description.innerText = i["description"]

    const scripturesLabel = document.createElement('h5')
    scripturesLabel.innerText = 'Scriptures'

    const mediaLabel = document.createElement('h5')
    mediaLabel.innerText = 'Other Resources'

    content.append(descriptionLabel)
    content.append(description)
    content.append(scripturesLabel)
    content.append(getScripturesHTML(i["scriptures"]))

    if (i["media"]) {
      content.append(mediaLabel)
      content.append(getMediaHTML(i["media"]))
    }

    cardBody.appendChild(title)
    cardBody.appendChild(date)
    cardBody.appendChild(content)

    card.appendChild(image)
    card.appendChild(cardBody)

    element.appendChild(card)

    root.appendChild(element)

    iter++
  }
}

const getScripturesHTML = (data) => {
  const listContainer = document.createElement('ul')
  for (let i of data) {
    const dataContainer = document.createElement('li')
    dataContainer.innerHTML = `${i["inClass"] ? '(&starf;)' : ''} ${i["book"]} ${formatVerses(i["verses"])} (${formatCollection(i["collection"])})`

    listContainer.appendChild(dataContainer)
  }
  return listContainer
}

const getMediaHTML = (data) => {
  const listContainer = document.createElement('ul')
  for (let i of data) {
    const dataContainer = document.createElement('li')
    const link = document.createElement('a')
    link.innerHTML = `${formatMediaType(i["type"])}: ${i["title"]} ${i["speaker"] ? (`(by ${i["speaker"]})`) : ''}`
    link.href = i["url"]

    dataContainer.appendChild(link)
    listContainer.appendChild(dataContainer)
  }
  return listContainer
}

const formatYear = (year) => {
  if (year < 0) {
    return `c. ${-year} BC`
  } else {
    return `c. ${year} AD`
  }
}

const formatVerses = (verses) => {
  let response = '';
  for (let i of verses) {
    if (response.length !== 0) {
      response += ', '
    }

    if (i["end"] === undefined) {
      // only one verse
      response += `${i["start"]["chapter"]}:${i["start"]["verse"]}`
    } else if (i["start"]["chapter"] === i["end"]["chapter"]) {
      response += `${i["start"]["chapter"]}:${i["start"]["verse"]}–${i["end"]["verse"]}`
    } else {
      response += `${i["start"]["chapter"]}:${i["start"]["verse"]}–${i["end"]["chapter"]}:${i["end"]["verse"]}`
    }
  }
  return response
}

const formatCollection = (book) => {
  switch (book) {
    case 'OT':
      return 'Old Testament'
    case 'NT':
      return 'New Testament'
    case 'BOM':
      return 'Book of Mormon'
    case 'DC':
      return 'Doctrine and Covenants'
    case 'PGP':
      return 'Pearl of Great Price'
  }
}

const formatMediaType = (type) => {
  switch (type) {
    case "video":
      return "Video"
    case "gospelTopic":
      return "Gospel Topics Page"
    case "conf":
      return "Conference Talk"
    case "liahona":
      return "Liahona Article"
    case "ensign":
      return "Ensign Article"
    case "byu":
      return "BYU Devotional"
    case "book":
      return "Book"
  }
}

const init = async() => {
  const data = await getData()

  populateTimeline(data)
}

document.addEventListener('DOMContentLoaded', function() {
  init()
})