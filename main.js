const tmdbServer = 'https://api.themoviedb.org/3';
const genresType = '/genre/movie/list' /* mem */
const myApiKey = '56a6519b540fc03f31a569d6c934a815';

var app = new Vue ({
    el: '#root',
    data: {
        maxActorshow: 5,
        moreDtl: false,
        genres: [],
        bestfiveActors: [],
        results: "",
        isLoading: false,
        search: '',
        films: [],
        languages: ['it','fr','de','ja','en','es']
    },
    methods: {
        searchFilm() {

            if (this.search.trim()) {
                this.films = [];
                this.isLoading = true;
                let currentsearch = this.search;
                axios.get(tmdbServer + '/search/movie', {
                    params: {
                        api_key: myApiKey,
                        query: currentsearch,
                        language: 'it'
                    }
                })
                .then((filmreply) => {
                    this.films = [...this.films,...filmreply.data.results];
                    this.isLoading = false;
                    console.log(this.films);

                });

                axios.get(tmdbServer + '/search/tv', {
                    params: {
                        api_key: myApiKey,
                        query: currentsearch,
                        language: 'it'
                    }
                })
                .then((tvreply) => {
                    this.films = [...this.films,...tvreply.data.results];
                    this.isLoading = false;
                    console.log(this.films);
                });

                this.results = this.search;
                this.search ="";
            }
        },
        takefilmDtl(film) {

            if (!this.moreDtl) {
                this.genres = [];
                this.bestfiveActors = [];

                if (film.title) {
                    axios.get(tmdbServer+'/movie/'+film.id, {
                        params: {
                            api_key: myApiKey,
                            language: 'it'
                        }
                    })
                    .then((replyid) => {
                        this.genres = replyid.data.genres;

                        console.log(this.genres);
                    });
                    axios.get(tmdbServer+'/movie/'+film.id+'/credits', {
                        params: {
                            api_key: myApiKey,
                        }
                    })
                    .then((actordReply) => {
                        actordReply.data.cast.forEach((item, i) => {
                            if (this.bestfiveActors.length < this.maxActorshow && item.known_for_department == "Acting") {
                                this.bestfiveActors.push(item.name);
                                console.log(item);
                            }
                        });
                        this.moreDtl = !this.moreDtl;
                        console.log(this.bestfiveActors);
                    })
                } else if (film.name) {
                    axios.get(tmdbServer+'/tv/'+film.id, {
                        params: {
                            api_key: myApiKey,
                            language: 'it'
                        }
                    })
                    .then((replyid) => {
                        this.genres = replyid.data.genres;
                        
                        console.log(this.genres);
                    });
                    axios.get(tmdbServer+'/tv/'+film.id+'/credits', {
                        params: {
                            api_key: myApiKey,
                        }
                    })
                    .then((actordReply) => {
                        actordReply.data.cast.forEach((item, i) => {
                            if (this.bestfiveActors.length < this.maxActorshow && item.known_for_department == "Acting") {
                                this.bestfiveActors.push(item.name);
                                console.log(item);
                            }
                        });
                        this.moreDtl = !this.moreDtl;
                        console.log(this.bestfiveActors);
                    })



                }

            } else {
                this.moreDtl = false;
            }

        }
    }










});
