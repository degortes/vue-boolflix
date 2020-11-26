const tmdbServer = 'https://api.themoviedb.org/3';
const genresType = '/genre/movie/list' /* mem */
const myApiKey = '56a6519b540fc03f31a569d6c934a815';
let css_width = 7000;
var app = new Vue ({
    el: '#root',
    data: {
        maxActorshow: 5,
        moreDtl: false,
        genres: [],
        bestfiveActors: [],
        currentFilm: "",
        results: "",
        isLoading: false,
        search: '',
        films: [],
        languages: ['it','fr','de','ja','en','es']
    },
    methods: {
        searchFilm() {

            if (this.search.trim()) {
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
                    this.films = filmreply.data.results
                    //creata inception in modo da avere tutti i risultati solo quando disponibili.
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
                    });
                });

                this.results = this.search;
                this.search ="";
            }
        },
        takefilmDtl(film) {

            if (!this.moreDtl) {
                this.gnrLoad = true;

                this.genres = [];
                this.bestfiveActors = [];
                this.currentFilm = film.id;
                axios.get(tmdbServer+'/movie/'+this.currentFilm, {
                    params: {
                        api_key: myApiKey,
                        language: 'it'
                        }
                    })
                .then((replyid) => {
                    let generi = replyid.data.genres;
                    generi.forEach((item, i) => {
                        this.genres.push(item.name);
                    });
                    console.log(this.genres);
                    this.gnrLoad = false;
                });
                this.actLoad = true;
                axios.get(tmdbServer+'/movie/'+this.currentFilm+'/credits', {
                    params: {
                        api_key: myApiKey,
                        language: 'it'
                    }
                })
                .then((actordReply) => {
                    actordReply.data.cast.forEach((item, i) => {
                        if (this.bestfiveActors.length < this.maxActorshow && item.known_for_department == "Acting") {
                            this.bestfiveActors.push(item.name);
                            console.log(item);
                            this.actLoad = false;
                        }
                    });
                    this.moreDtl = !this.moreDtl;
                    console.log(this.bestfiveActors);
                })
            } else {
                this.moreDtl = false;
            }

        }
    }










});
