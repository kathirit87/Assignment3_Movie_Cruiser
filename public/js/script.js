let moveList = [];
let favMovieList = [];

function getMovies() {
	
    return fetch("http://localhost:3000/movies")
	.then(response => response.json())
	.then(movies => {		
		moveList = movies;
		//document.getElementById('moviesList').innerHTML = moveList;
		const moveListUL = document.getElementById('moviesList');
		movies.forEach(element => {
			const li = document.createElement('li');
			const liInnerHtml =`
				<div class="list-group-item list-group-item-primary">
					<h4 data-value=${element.title}>Movie : ${element.title}</h4>					
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
		return Promise.resolve(Error(err))
	});
	
}

function getFavourites() {	
	const favListUL = document.getElementById('favouritesList');	
    return fetch("http://localhost:3000/favourites")
	.then(response => response.json())
	.then(favourites => {
		favMovieList = favourites;
		favourites.forEach(element => {
				const li = document.createElement('li');
				li.id =element.id;
				const liInnerHtml =`
					<div class="list-group-item list-group-item-primary">
						<h4 data-value=${element.title}>Movie : ${element.title}</h4>					
						<img src="${element.posterPath}" class="mx-auto d-block"  alt="Poster image">					
						<p class="d-flex textblock" >${element.overview} </p>											
					</div>
				`;
				li.innerHTML = liInnerHtml;
				favListUL.appendChild(li);
		});
		return favourites;
	})
	.catch((err)=>{
		return Promise.resolve(Error(err))
	});

}

let getMovie = (id, arr) => arr.find(movie => movie.id === id);

function addFavourite(arg) {
	
	if(getMovie(Number(arg),favMovieList)){
		alert("Movie is already added to favourites")
		return Promise.reject({message: 'Movie is already added to favourites'});
	}
	const favListUL = document.getElementById('favouritesList');
	let data = getMovie(Number(arg),moveList);
	const li = document.createElement('li');
	li.id = data.id;
	const liInnerHtml =`
		<div class="list-group-item list-group-item-primary">
			<h4 data-value=${data.title}>Movie : ${data.title}</h4>					
			<img src="${data.posterPath}" class="mx-auto d-block"  alt="Poster image">					
			<p class="d-flex textblock" >${data.overview} </p>						
		</div>
	`;
	li.innerHTML = liInnerHtml;
	favListUL.appendChild(li);
	return fetch(`http://localhost:3000/favourites`,{
		method: "POST",
		body :JSON.stringify(data),
		headers:{
			'Content-Type': 'application/json'
			}
	})
	.then(() => favMovieList.push(data) && favMovieList)// JSON from `response.json()` call
	.catch(error => Promise.resolve(Error(error)));
}

/* function removFavourite(val){
	console.log(favMovieList);
	let item = document.getElementById(val);
	favMovieList.forEach(data => {
		console.log(data);		
		if(item && item.id===data.id){
			item.parentNode.removeChild(item);
			favMovieList.splice(data);
			return fetch(`http://localhost:3000/favourites`+`/`+data.id, {
				method: 'delete',
				body : JSON.stringify(data),
				headers:{
					'Content-Type': 'application/json',
					'Access-Control-Allow-Methods': 'DELETE'
				  }
			  })
			  .then(response => console.log(response.json()))
			  .catch(error => console.error(Promise.resolve(Error(err))));
		}

	});
} */
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
