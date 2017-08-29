// sendApiRequest is called through a search button
// utilizes Google Books API
// once user clicks on the displayed results from Google API
// sent to The Movie Database API through sendMovieRequest()
function sendApiRequest() {
    // removes existing child nodes under the "bookresults" div
    // doesn't matter if none exist
    clearBook();
    // refer above, but under "movieresults" div
    clearMovie();

    // search bar input
    var userInput = document.getElementById("input").value;

    // API info
    //var bookApiKey = "AIzaSyBHfMDRvPQyGpzqgQraKVgrGAu9PV4IQEE";
    var bookApi = `https://www.googleapis.com/books/v1/volumes?q=${userInput}`;

    // start of Google Books API use
    fetch(bookApi)
        .then(function(data) {
            return data.json()
        })
        .then(function(json) {

            // start for loop
            for (var i = 0; i < 10 && i < json.items.length; i++) {
                bookTitle = json.items[i].volumeInfo.title
                // takes the first author's name only
                author = json.items[i].volumeInfo.authors[0]
                displayName = bookTitle + " by " + author

                // DOM manipulation
                // <p class = "bookTitle" onclick ="...sendmovieRequest..."> displayName </p>
                child = document.createElement("p")
                child.setAttribute('class', 'bookTitle')
                child.innerHTML = displayName
                child.addEventListener("click", function() {
                    entireTitle = this.innerHTML
                    strings = entireTitle.split("by")
                    //bops off author and other stuff
                    strings.pop()
                    bookTitle = strings.join("by")

                    sendMovieRequest(bookTitle, entireTitle)
                })

                var bookDiv = document.getElementById("bookresults")
                bookDiv.appendChild(child)
            }
            // end for loop
        })
}

function sendMovieRequest(string, entireTitle) {

    // replaces spaces with +
    searchBookTitle = string.split(' ').join('+')

    var movieApiKey = "e6aa067ea41a844458f5aaba21ad2ebd"
    var movieApiUrl = `https://api.themoviedb.org/3/search/movie?api_key=e6aa067ea41a844458f5aaba21ad2ebd&query=${searchBookTitle}`

    fetch(movieApiUrl)
        .then(function(data) {
            return data.json()
        })
        .then(function(json) {

            console.log("length of movies found: " + json.results.length)

            // case of no matching movies
            // no results come up, checks through 0
            if (json.results.length == 0) {
                title = document.createElement("p")
                title.setAttribute('class', 'movieTitle')
                title.innerHTML = "No matching movies";
                var body = document.getElementById("movieresults")
                body.appendChild(title)
            }

            // start for loop
            for (var int = 0; int < json.results.length && int < 10; int++) {

                movie = json.results[int].title
                let title = document.createElement("a")
                title.setAttribute('class', 'movieTitle')
                title.innerHTML = movie;
                var body = document.getElementById("movieresults")
                body.appendChild(title)
                br = document.createElement("br")
                br.setAttribute('class', 'movieTitle')
                body.appendChild(br)

                id = json.results[int].id
                var movieDetailsUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=e6aa067ea41a844458f5aaba21ad2ebd`

                fetch(movieDetailsUrl)
                    .then(function(data) {
                        return data.json()
                    })
                    .then(function(json) {
                        imid = json.imdb_id
                        IMDB_link = `http://www.imdb.com/title/${imid}/`
                        console.log(IMDB_link);
                        title.setAttribute('href', IMDB_link)
                        console.log("success")
                    })
            }
            // end for loop

        })

    // clears all book results
    clearBook()
    // reappends the book being searched into a movie
    title = document.createElement("p")
    title.setAttribute('class', 'bookTitle')
    title.innerHTML = entireTitle
    title.addEventListener("click", function() {
        entireTitle = this.innerHTML
        strings = entireTitle.split("by")
        //bops off author and other stuff
        strings.pop()
        bookTitle = strings.join("by")

        sendMovieRequest(bookTitle, entireTitle)
    })
    var body = document.getElementById("bookresults")
    body.appendChild(title)
}

function getDetails(id) {
    var movieDetailsUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=e6aa067ea41a844458f5aaba21ad2ebd`
    var id = ""

    fetch(movieDetailsUrl)
        .then(function(data) {
            return data.json()
        })
        .then(function(json) {
            console.log(json)
            console.log("imdb_id: " + json.imdb_id)
            id = json.imdb_id
            console.log("id: " + id)
        })
    console.log("id thing: " + id)
    return `http://www.imdb.com/title/${id}/`
}

// retrieves the div "bookresults"
// retrieves a list of elements with class "bookTitle"
// removes everything from bookresults
function clearBook() {
    var bookTitles = document.getElementsByClassName("bookTitle")
    var body = document.getElementById("bookresults")
    while (bookTitles.length > 0) {
        body.removeChild(bookTitles[0])
    }
}

// similar to above
function clearMovie() {
    var movieTitles = document.getElementsByClassName("movieTitle")
    var body = document.getElementById("movieresults")
    while (movieTitles.length > 0) {
        body.removeChild(movieTitles[0])
    }
}
