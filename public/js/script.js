let moveList = [];
let favMovieList = [];

const postData = (url = ``, data = {}) => {
	// Default options are marked with *
	  return fetch(url, {
		  method: "POST", // *GET, POST, PUT, DELETE, etc.
		  mode: "cors", // no-cors, cors, *same-origin
		  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		  credentials: "same-origin", // include, same-origin, *omit
		  headers: {
			  "Content-Type": "application/json; charset=utf-8",
			  // "Content-Type": "application/x-www-form-urlencoded",
		  },
		  redirect: "follow", // manual, *follow, error
		  referrer: "no-referrer", // no-referrer, *client
		  body: JSON.stringify(data), // body data type must match "Content-Type" header
	  })
	  .then(response => response.json()) // parses response to JSON
	  .catch(error => console.error(`Fetch Error =\n`, error));
  };

function getMovies() {
	console.log("inside getmovies");

    return fetch("http://localhost:3000/movies")
	.then(response => response.json())
	.then(movies => {
		
		moveList = movies;
		//document.getElementById('moviesList').innerHTML = moveList;
		const moveListUL = document.getElementById('moviesList');
		movies.forEach(element => {
			
			console.log('movieList ::'+element);
			const li = document.createElement('li');
			const liInnerHtml =`
				<div class="list-group-item list-group-item-primary">
					<h4 id="${element.id}" data-value=${element.title}>Movie : ${element.title}</h4>					
					<img src="${element.posterPath}" class="mx-auto d-block"  alt="Poster image">					
					<p class="d-flex textblock" >${element.overview} </p>
					<button type="submit" class="btn btn-primary btn-block" onclick="addFavourite(${element.id})">AddToFavourites</button>
					
				</div>
			`;
			li.innerHTML = liInnerHtml;
			moveListUL.appendChild(li);
		});		
		return movies;
	})
	.catch((err)=>{
		return Promise.reject(Error(err))
	});
	
}

function getFavourites() {

	console.log("inside getFavourites");
	const favListUL = document.getElementById('favouritesList');

    return fetch("http://localhost:3000/favourites")
	.then(response => response.json())
	.then(favourites => {
		favMovieList = favourites;

		favourites.forEach(element => {		
			console.log('element.name ::'+element.title);			
				const li = document.createElement('li');
				const liInnerHtml =`
					<div class="list-group-item list-group-item-primary">
						<h4 id="${element.id}" data-value=${element.title}>Movie : ${element.title}</h4>					
						<img src="${element.posterPath}" class="mx-auto d-block"  alt="Poster image">					
						<p class="d-flex textblock" >${element.overview} </p>
						<button type="submit" class="btn btn-primary btn-block" onclick="removFavourite(${element.id})">RemoveFavourites</button>					
					</div>
				`;
				li.innerHTML = liInnerHtml;
				favListUL.appendChild(li);			
				
		});
		return favourites;
	})
	.catch((err)=>{
		return Promise.reject(Error(err))
	});

}

function addFavourite(arg) {

	console.log("inside addFavourite" +arg);

	const favListUL = document.getElementById('favouritesList');

	let isfavListExists = false;

	// let movieNamebyId = document.getElementById("movieName");
	// console.log('movieNamebyId ::'+movieNamebyId);
	console.log("favMovieList : "+favMovieList);
	if(favMovieList!== null){

		favMovieList.forEach(data => {
			if(data!== null && data.id === arg){
				console.log(data);
				alert("Movie already exists in Favourites!!!!")
				isfavListExists = true;
				return;
			}
		})
	}

	console.log("isfavListExists flag :: "+isfavListExists);
	console.log("moveList :: "+moveList);
	if(!isfavListExists){
		moveList.forEach(function (data) {
		
			console.log('element.name ::'+data.title);
			if(data.id === arg){
				const li = document.createElement('li');
				const liInnerHtml =`
					<div class="list-group-item list-group-item-primary">
						<h4 id="${data.id}" data-value=${data.title}>Movie : ${data.title}</h4>					
						<img src="${data.posterPath}" class="mx-auto d-block"  alt="Poster image">					
						<p class="d-flex textblock" >${data.overview} </p>
						<button type="submit" class="btn btn-primary btn-block" onclick="removFavourite(${data.id})">RemoveFavourites</button>					
					</div>
				`;
				li.innerHTML = liInnerHtml;
				favListUL.appendChild(li);
				
				favMovieList.push(data);
				fetch(`http://localhost:3000/favourites`,{
					method: "POST",
					body :JSON.stringify(data),
					headers:{
						'Content-Type': 'application/json'
					  }
				})
				.then(resdata => console.log(resdata))// JSON from `response.json()` call
				.catch(error => console.error(Promise.reject(Error(err))));
			}		
		});
	}
		
}

function removFavourite(id){
	console.log(favMovieList);
	favMovieList.forEach(data => {
		console.log(data);
		if(data.id===id){
			const list = document.getElementById('favouritesList');

			list.removeChild(list.childNodes[0]);

			return fetch(`http://localhost:3000/favourites`, {
				method: 'delete',
				body : JSON.stringify(data)
			  })
			  .then(response => console.log(response.json()))
			  .catch(error => console.error(Promise.reject(Error(err))));
		}

	});
}
// invoke getMovies function and manipulate DOM 

module.exports = {
	getMovies,
	getFavourites,
	addFavourite
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution
