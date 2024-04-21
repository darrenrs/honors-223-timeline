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
  document.querySelector('#status').innerText = ''
  
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
    if (i["image"]) {
      image.classList.add('card-img-top')
      image.alt = i["title"]
      image.src = i["image"]
    }

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body', 'p-3')

    if (i["type"] === "C") {
      cardBody.classList.add('background-cs')
    } else if (i["type"] === "L") {
      cardBody.classList.add('background-lit')
    }

    const title = document.createElement('h4')
    title.classList.add('fw-bold')
    title.innerText = i["title"]

    const author = document.createElement('h5')
    author.innerText = i["author"]

    const date = document.createElement('p')
    date.classList.add('text-muted')
    date.innerText = formatYear(i["year"])

    const content = document.createElement('div')
    content.classList.add('card-body', 'p-1')

    const descriptionLabel = document.createElement('h5')
    descriptionLabel.innerText = 'Description'

    const description = document.createElement('p')
    description.innerText = i["description"]

    content.append(descriptionLabel)
    content.append(description)

    cardBody.appendChild(title)
    cardBody.appendChild(author)
    cardBody.appendChild(date)
    cardBody.appendChild(content)
    
    if (i["image"]) {
      card.appendChild(image)
    }
    card.appendChild(cardBody)

    element.appendChild(card)

    root.appendChild(element)

    iter++
  }
}

const formatYear = (year) => {
  return `Released/Published ${year}`
}

const init = async() => {
  const data = await getData()

  populateTimeline(data)
}

document.addEventListener('DOMContentLoaded', function() {
  init()
})