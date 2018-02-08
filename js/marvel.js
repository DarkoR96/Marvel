var STORAGE_KEY = 'bookmarkedHeroes-user'
var BOOKMARK_CLASS = '<i class="fas fa-heart"></i>';
var UNBOOKMARK_CLASS = '<i class="far fa-heart"></i>';
var pageLimit = 12;
//--- LOCAL STORAGE ---//
var bookmarkedHeroStorage = {
  fetch(){
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },
  save(bookmarkedHeroes){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarkedHeroes));
  }
}
//--- APP SETUP ---//
var app = new Vue({
  el: '#app',
  data: {
    heroes: [],
    bookmarkedHeroes: bookmarkedHeroStorage.fetch(),
    off: 0,
    footer: '',
    afterApi: false,
    search: ''
  },
  watch: {
    bookmarkedHeroes: {
      handler(bookmarkedHeroes){
        bookmarkedHeroStorage.save(bookmarkedHeroes);
        this.searchHero();
      },
      deep: true
    }
  },
  //--- BOOKMARK ---//
  methods: {
    addBookmarkedHero(hero){
     this.bookmarkedHeroes.push(hero);
    },

    removeBookmarkedHero(hero){
      var index = this.bookmarkedHeroes.map(function(e) { return e.id; }).indexOf(hero.id);
      this.bookmarkedHeroes.splice(index, 1);
    },

    hasBookmarkedHero(hero){
      var index = this.bookmarkedHeroes.map(function(e) { return e.id; }).indexOf(hero.id);
      return index !== -1;
    },
    bookmarkHero(hero){
        if (this.hasBookmarkedHero(hero)){
          this.removeBookmarkedHero(hero);
          hero.star = UNBOOKMARK_CLASS;
        }
        else {
          hero.star = BOOKMARK_CLASS;
          this.addBookmarkedHero(hero);
        }
        this.$forceUpdate();
    },
    //--- GET HEROES ---//
    searchHero(){
      var conLoad = document.getElementById('conLoad');
      var self = this;
      if(this.search !== ""){
        conLoad.innerHTML = 'Loading...';
        var offset = this.off;
        var url = 'http://gateway.marvel.com/v1/public/characters?ts=1&apikey=9b182ff77825966383bece03b26b7bcc&hash=f5ec867d20f987a5cab8219cf7fa8c23';
        var name= '&nameStartsWith=';
        axios({
          method:'GET',
          url: url + name + self.search,
          params: {
            offset: offset,
            limit: pageLimit
          }
        })
        .then(function(response) {
          var btn = document.getElementById('next');
          conLoad.innerHTML = '';
          var heroes = response.data.data.results;
          self.heroes = heroes.map(function(item){
            item.star = self.hasBookmarkedHero(item) ? BOOKMARK_CLASS : UNBOOKMARK_CLASS;
            return item;
          });
          self.footer = response.data;
          self.afterApi = true;
        });
      }
      else {
          self.heroes = bookmarkedHeroStorage.fetch();
      }
    },
    // --- NEXT & PREV BUTTONS ---//
    pagination(value){
      if(value == 'next'){
        this.off = this.off + pageLimit;
      }
      else {
        this.off = this.off - pageLimit;
      }
      this.searchHero();
    },
    //--- CLEAR SEARCH ---//
    clearSearch(){
      this.search = "";
      if(bookmarkedHeroStorage.fetch().length <= 0){
        this.afterApi = true;
      }
      else {
        this.afterApi = false;
      }
    }
  },
  
})
