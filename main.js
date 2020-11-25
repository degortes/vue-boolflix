var app = new Vue ({
    el: '#root',
    data: {
        results: "",
        isLoading: false,
        mySelection: [],
        search: '',
        films: [],
        //elementi series e allshow create solo nel caso ci sia bisogno di filtrare gli array in futuro.
        series: [],
        allshow: [],
        languages: ['it','fr','de','ja','en','es']
    },
    methods: {
        searchFilm() {

            if (this.search.trim()) {
                this.isLoading = true;

                let currentsearch = this.search;
                axios.get('https://api.themoviedb.org/3/search/movie', {
                    params: {
                        api_key: '56a6519b540fc03f31a569d6c934a815',
                        query: currentsearch,
                        language: 'it'
                    }
                })
                .then((filmreply) => {
                    this.films = filmreply.data.results
                    //creata inception in modo da avere tutti i risultati solo quando disponibili.
                    axios.get('https://api.themoviedb.org/3/search/tv', {
                        params: {
                            api_key: '56a6519b540fc03f31a569d6c934a815',
                            query: currentsearch,
                            language: 'it'
                        }
                    })
                    .then((tvreply) => {
                        this.series = tvreply.data.results;
                        this.allshow = [...this.films,...this.series];
                        this.mySelection = this.allshow;
                        this.isLoading = false;
                    });


                });

                this.results = this.search;
                this.search ="";
            }
        }
    }










});
