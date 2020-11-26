



const tmdbServer = 'https://api.themoviedb.org/3';
const myApiKey = '56a6519b540fc03f31a569d6c934a815';

var app = new Vue ({
    el: '#root',
    data: {
        filter: false,
        order: false,
        oldSelection : [],
        pcGnr: [],
        selectGnr: 'all',
        maxActorshow: 5,
        moreDtl: false,
        isLoading: false,
        results: "",
        search: '',
        humGnr: [],
        serverTvGen: [],
        serverMovGen: [],
        myTvGen: [],
        myMovGen: [],
        films: [],
        movie:[],
        tvShow:[],
        genres: [],
        bestfiveActors: [],
        languages: ['it','fr','de','ja','en','es']
    },
    methods: {

        isClick(x) {
            this.films = [];
            this.films = x;
            this.order = false;
            this.filter = false;
        },
        sortByStar() {
            this.filter = false;
            if (!this.order) {
                this.films.sort((a,b) => (a.vote_average > b.vote_average? -1 : 1));
                this.order = true;
            } else {
                this.films.reverse();
                this.order = false;
            }
        },
        sortByPop() {
            this.order = false;
            if (!this.filter) {
                this.films.sort((a,b) => (a.popularity > b.popularity? -1 : 1));
                this.filter = true;

            } else {
                this.films.reverse();
                this.filter = false;
            }
        },


        searchFilm() {

            if (this.search.trim()) {
                this.filter = false;
                this.order = false;
                this.pcGnr = [];
                this.selectGnr = 'all';
                this.films = [];
                this.tvShow = [];
                this.movie = [];
                this.isLoading = true;
                this.myTvGen = [];
                this.myMovGen = [];
                this.humGnr = [];
                this.oldSelection = [];

                let currentsearch = this.search;

                axios.get(tmdbServer + '/search/movie', {
                    params: {
                        api_key: myApiKey,
                        query: currentsearch,
                        language: 'it'
                    }
                })
                .then((filmreply) => {
                    this.movie = [...this.movie,...filmreply.data.results];
                    this.isLoading = false;
                    this.films = [...this.tvShow,...this.movie];
                    this.oldSelection = [...this.oldSelection,...this.films];

                    this.movie.forEach((item) => {
                        item.genre_ids.forEach((elem) => {
                            if (!this.myMovGen.includes(elem)) {
                                this.myMovGen.push(elem)
                            }
                        });
                    });

                    this.serverMovGen.forEach((item, i) => {
                        this.myMovGen.forEach((elem, i) => {
                            if (item.id == elem && !this.pcGnr.includes(item.id)) {
                                this.humGnr.push(item.name);
                                this.pcGnr.push(item.id)
                            }
                        });
                    });

                });

                axios.get(tmdbServer + '/search/tv', {
                    params: {
                        api_key: myApiKey,
                        query: currentsearch,
                        language: 'it'
                    }
                })
                .then((tvreply) => {
                    this.tvShow = [...this.tvShow,...tvreply.data.results];
                    this.isLoading = false;
                    this.films = [...this.tvShow,...this.movie];
                    this.tvShow.forEach((item) => {
                        item.genre_ids.forEach((elem) => {
                            if (!this.myTvGen.includes(elem)) {
                                this.myTvGen.push(elem)
                            }
                        });
                    });
                    console.log(this.myTvGen);
                    this.serverTvGen.forEach((item, i) => {
                        this.myTvGen.forEach((elem, i) => {
                            if (item.id == elem && !this.pcGnr.includes(item.id)) {
                                this.humGnr.push(item.name);
                                this.pcGnr.push(item.id);
                            }
                        });
                    });
                    console.log(this.pcGnr);
                });
                this.oldSelection = this.films;
                this.results = this.search;
                this.search ="";
            }
        },
        takefilmDtl(film) {

            if (!this.moreDtl) {
                this.genres = [];
                this.bestfiveActors = [];
                //cerco i generi MOVIE nei credits
                if (film.title) {
                    film.genre_ids.forEach((item, i) => {
                        this.serverMovGen.forEach((elem, i) => {
                            if (item == elem.id) {
                                this.genres.push(elem.name)
                            }
                        });
                    });
                    //cerco gli attori MOVIE attori
                    axios.get(tmdbServer+'/movie/'+film.id+'/credits', {
                        params: {
                            api_key: myApiKey,
                        }
                    })
                    .then((actordReply) => {
                        actordReply.data.cast.forEach((item) => {
                            if (this.bestfiveActors.length < this.maxActorshow && item.known_for_department == "Acting") {
                                this.bestfiveActors.push(item.name);
                                console.log(item);
                            }
                        });
                        this.moreDtl = !this.moreDtl;
                    })
                } else if (film.name) {

                    film.genre_ids.forEach((item, i) => {
                        this.serverTvGen.forEach((elem, i) => {
                            if (item == elem.id) {
                                this.genres.push(elem.name)
                            }
                        });

                    });

                    axios.get(tmdbServer+'/tv/'+film.id+'/credits', {
                        params: {
                            api_key: myApiKey,
                        }
                    })
                    .then((actordReply) => {
                        actordReply.data.cast.forEach((item) => {
                            if (this.bestfiveActors.length < this.maxActorshow && item.known_for_department == "Acting") {
                                this.bestfiveActors.push(item.name);
                            }
                        });
                        this.moreDtl = !this.moreDtl;
                    })
                }
            } else {
                this.moreDtl = false;
            }
        }
    },
    mounted() {
        axios.get(tmdbServer+'/genre/tv/list', {
            params: {
                api_key: myApiKey,
                language: 'it'
            }
        })
        .then((tvgenreply) => {
            this.serverTvGen = tvgenreply.data.genres;
        })
        axios.get(tmdbServer+'/genre/movie/list', {
            params: {
                api_key: myApiKey,
                language: 'it'
            }
        })
        .then((movgenreply) => {
            this.serverMovGen = movgenreply.data.genres;
        })
    }










});
