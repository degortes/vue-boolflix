const tmdbServer = 'https://api.themoviedb.org/3';
const myApiKey = '56a6519b540fc03f31a569d6c934a815';

var app = new Vue ({
    el: '#root',
    data: {
        dateFilter: false,
        servicePage: false,
        filter: false,
        order: false,
        oldSelection: [],
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
        serviceAdvise() {
            Vue.nextTick(function() {
                if (!app.$refs.test.length) {
                    app.servicePage = true;
                } else {
                    app.servicePage = false;
                }
            });
        },
        isClick(x) {
            this.films = x;
            this.dateFilter = false;
            this.order = false;
            this.filter = false;
            this.serviceAdvise();
        },
        sortByStar() {
            this.dateFilter = false
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
            this.dateFilter = false
            this.order = false;
            if (!this.filter) {
                this.films.sort((a,b) => (a.popularity > b.popularity? -1 : 1));
                this.filter = true;
            } else {
                this.films.reverse();
                this.filter = false;
            }
        },
        sortByDate() {
            this.order = false;
            this.filter = false;
            if (!this.dateFilter) {
                this.films.sort((a,b) => (a.anno > b.anno? -1 : 1));
                this.dateFilter = true;

            } else {
                this.films.reverse();
                this.dateFilter = false;
            }
        },
        searchFilm() {
            if (this.search.trim()) {
                this.oldSelection = [];
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

                let currentsearch = this.search;

                axios.get(tmdbServer + '/search/movie', {
                    params: {
                        api_key: myApiKey,
                        query: currentsearch,
                        language: 'it'
                    }
                })
                .then((filmreply) => {
                    filmreply.data.results.forEach((item, i) => {

                        if (item.release_date) {
                            let year = item.release_date;
                            item = {...item, anno: year }
                            this.movie.push(item);
                        } else {
                            item = {...item, anno: 0000 }
                            this.movie.push(item);
                        }
                    });
                    this.films = [...this.movie,...this.films];
                    this.oldSelection = [...this.movie,...this.oldSelection];
                    this.isLoading = false;

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
                    tvreply.data.results.forEach((item, i) => {
                        if (item.first_air_date != 0) {
                            let year = item.first_air_date
                            item = {...item, anno: year }
                            this.tvShow.push(item);
                        } else {
                            item = {...item, anno: 0000 }
                            this.tvShow.push(item);
                        }
                    });
                    this.films = [...this.tvShow,...this.films];
                    this.oldSelection = [...this.tvShow,...this.oldSelection];
                    this.tvShow.forEach((item) => {
                        item.genre_ids.forEach((elem) => {
                            if (!this.myTvGen.includes(elem)) {
                                this.myTvGen.push(elem)
                            }
                        });
                    });

                    this.isLoading = false;

                    this.serverTvGen.forEach((item, i) => {
                        this.myTvGen.forEach((elem, i) => {
                            if (item.id == elem && !this.pcGnr.includes(item.id)) {
                                this.humGnr.push(item.name);
                                this.pcGnr.push(item.id);
                            }
                        });
                    });
                });

                this.results = this.search;
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
                    this.moreDtl = !this.moreDtl;
                    axios.get(tmdbServer+'/movie/'+film.id+'/credits', {
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
                    });
                } else if (film.name) {

                    film.genre_ids.forEach((item, i) => {
                        this.serverTvGen.forEach((elem, i) => {
                            if (item == elem.id) {
                                this.genres.push(elem.name)
                            }
                        });

                    });

                    this.moreDtl = !this.moreDtl;
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
                    });
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
