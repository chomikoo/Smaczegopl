(function($) {

    $(document).ready(function() {

        class AjaxFilter {
            constructor() {
                this.$window = $(window);
                this.$filterForm = $('#recipe-filter');
                this.$resultDiv = $('#ajax_filter_results');
                               
                this.$loadMoreBtn = $('.btn--loadmore:not(.loading)');
                this.$btnText = this.$loadMoreBtn.find('.btn__text');
                this.$btnIco = this.$loadMoreBtn.find('.icon--loading');
                this.prev = this.$loadMoreBtn.data('prev');
                this.pageURL = window.location.href;
                this.tempURL = '';
                
                this.kcal_min = '',
                this.kcal_max = '',
                this.time_min = '',
                this.time_max = '',
                this.recipe_assets = [];

                this.last_scroll = 0;

                this.events();
            }
            
            events() {
                this.$filterForm.on('submit', this.getResults.bind(this));
                this.$loadMoreBtn.on('click', this.getMorePosts.bind(this));
                // this.$window.on('scroll', this.updateURL.bind(this));
            }

            updateURL() {
                let scroll = $(window).scrollTop();
                const arrayURL = this.pageURL.replace(/\/$/, "").split('/');
                
                if( Math.abs( scroll - this.last_scroll ) > $(window).height()*0.1 ) {
                    this.last_scroll = scroll;
                    
                    const that = this;
                    $('.page-limit').each(function( index ){

                        if( isVisible( $(this) ) ){

                            let pageSlug = $(this).attr("data-page").replace(/^\/+/g, '').split('/');
                            console.log('url ' , that.tempURL.join('/'));
                 
                            return(false);
                        }
                    });
                }

            }

            prepareData(page = 1, prev = 1) {

                this.category_filter = this.$filterForm.find('#category_filter').val();
                this.sort_terms = this.$filterForm.find('#sort_terms').val();
                this.kcal_min = this.$filterForm.find('#kcal_min').val();
                this.kcal_max = this.$filterForm.find('#kcal_max').val();
                this.time_min = this.$filterForm.find('#time_min').val();
                this.time_max = this.$filterForm.find('#time_max').val();
  
                if( this.$filterForm.find('#checkbox_vege').is(':checked') ){
                    this.recipe_assets.indexOf('vege') === -1 ? this.recipe_assets.push('vege') : false;
                }
                
                if( this.$filterForm.find('#checkbox_meat').is(':checked') ){
                    this.recipe_assets.indexOf('without-meat') === -1 ? this.recipe_assets.push('without-meat') : false;
                }
    
                if( this.$filterForm.find('#checkbox_sugar').is(':checked') ){
                    this.recipe_assets.indexOf('without-sugar') === -1 ? this.recipe_assets.push('without-sugar') : false;
                }            
    
                if( this.$filterForm.find('#checkbox_gluten').is(':checked') ){
                    this.recipe_assets.indexOf('without-gluten') === -1 ? this.recipe_assets.push('without-gluten') : false;
                }
    
                const data = {
                    action : "chomikoo_ajax_filter_function",
                    page: page,
                    // prev: prev,
                    category_filter: this.category_filter,
                    sort_terms: this.sort_terms,
                    kcal_min: this.kcal_min,
                    kcal_max: this.kcal_max,
                    time_min: this.time_min,
                    time_max: this.time_max,
                    recipe_assets: this.recipe_assets
                }
                console.log(data);
                return data;
            }


            // Filter results
            getResults(e) {
                e.preventDefault();

                $('btn--loadmore').attr('data-page', '1');

                const data = this.prepareData();
    
                $.ajax({
                    url: this.$filterForm.attr('action'),
                    data: data,
                    context: this,
                    type: this.$filterForm.attr('method'),
                })
                .done(function(response){
                    $('#ajax_filter_results').html('').append( response );
                    this.revealArticles();
                 }
                )
                .fail(function(err) {
                    console.log('Fail',err);
                })
            }

            // Next & Prev pages
            getMorePosts(e) {
                e.preventDefault();
                let prev = parseInt(e.target.dataset.prev);
                let page = parseInt(e.target.dataset.page);
                let newPage = page;

                newPage = ( e.target.dataset.prev ) ? page-1 : page+1;
                
                const data = this.prepareData(newPage);     
       
                this.$btnText.html('Ładuje ...');
                this.$loadMoreBtn.addClass('loading');
    
                $.ajax({
                    url: this.$filterForm.attr('action'),
                    data: data,
                    context: this,
                    type: this.$filterForm.attr('method'),
                })
                .done(function(response){
                    if( response == 0 ) { // End posts list
                        $('#ajax_filter_results').append(
                            `
                            <div class="text-center">
                                <h3>Dotarłeś do końca listy przepisów</h3>
                            </div>
                            `
                        )
                        $('.btn__loadNext').slideUp();
                    } else {
                        if( prev == 1) {
                            $('#ajax_filter_results').prepend( response );
                            $('.btn__loadPrev').attr('data-page', newPage);
                            if(newPage == 1) {
                                console.log("Hide btn " , $('.btn__loadPrev').closest('.pagination'));                    
                                $('.btn__loadPrev').closest('.paginaiton').slideUp();
                            }                            
                        } else {
                            $('#ajax_filter_results').append( response );
                            $('.btn__loadNext').attr('data-page', newPage);
                        }

                        setTimeout(()=> {
                            this.$btnText.html('Ładuj nastepne');
                            this.$loadMoreBtn.removeClass('loading');
                            this.revealArticles();
                        },500);
                    }
                })
                .fail(function() {
                    console.log('Fail');
                })
         
            }
            
      

            revealArticles() {
                const notRevealArticles = $('.recipe:not(.reveal)');
                let i = 0;

                setInterval(()=> {
                    if( i >= notRevealArticles.length ) return false;
                    const article = notRevealArticles[i];
                    $(article).addClass('reveal');
                    i++;
                },200);
            }

        }

        
        const ajaxFilter = new AjaxFilter();
        
    });
    

})(jQuery)