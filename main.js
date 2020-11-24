var app = new Vue ({
    el: '#root',
    data: {
        search: '',
        films: [],
        languages: ['it','fr','de','ja','en','es']
    },
    methods: {
        searchFilm() {
            let currentsearch = this.search;
            axios.get('https://api.themoviedb.org/3/search/movie', {
                params: {
                    api_key: '56a6519b540fc03f31a569d6c934a815',
                    query: currentsearch,
                    language: 'it'
                }
            })
            .then((risposta) => {
                this.films = risposta.data.results
                console.log(this.films);
            });

            axios.get('https://api.themoviedb.org/3/search/tv', {
                params: {
                    api_key: '56a6519b540fc03f31a569d6c934a815',
                    query: currentsearch,
                    language: 'it'
                }
            })
            .then((risposta) => {
                risposta.data.results.forEach((item, i) => {
                    this.films.push(item)
                });
            });

        }
    }










});
