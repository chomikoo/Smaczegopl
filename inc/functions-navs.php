<?php
/**
 * Portfolio: Navs
 *
 * @package WordPress
 * @subpackage Smaczegopl
 * 
 */


// Register Menu
function chomikoo_custom_menu() {
	register_nav_menus(
	array(
		'top-menu' => __( 'Menu' ),
		'social-menu' => __( 'Social menu' )
		)
	);
}
add_action( 'init', 'chomikoo_custom_menu' );


function chomikoo_menu_classes($classes, $item, $args) {
	if($args->theme_location == 'top-menu') {
		$classes[] = 'container';
	}

	return $classes;
}
add_filter('nav_menu_css_class', 'chomikoo_menu_classes', 1, 3);
	
// class Walker_Nav_Primary extends Walker_Nav_menu {
// 	function start_lvl( &$output, $depth) {
// 		$indent = str_repeat("\t", $depth);
// 		$submenu = ($depth > 0) ? ' sub-menu' : '';
// 		$output .= "\n$indent<ul class=\"dropdown-menu$submenu depth_$depth\">\n";
// 	}

// }

// POST NAV
	function chomikoo_the_post_nav() {

		echo '<div class="row mx-auto post-nav">';
			
		$prevPost = get_previous_post();

		if( $prevPost ) {

			if( has_post_thumbnail( $prevPost->ID ) ) {
				
				$prevthumbnail = wp_get_attachment_image_src( get_post_thumbnail_id( $prevPost->ID ), 'secondary-thumb' );
				
				$prevthumbnail = $prevthumbnail[0];
				
			} else {
				
				$prevthumbnail = get_stylesheet_directory_uri() . '/dist/images/default.jpg';
				
			}
			
			$prevpermalink = get_post_permalink($prevPost->ID);

			echo '<a href="' . $prevpermalink . '" class="col-12 col-sm-12 col-md-6 post-nav__prev">';
			
			setup_postdata( $prevPost ); 

				echo '<div style="background-image:url(' . $prevthumbnail . ')" class="post-nav__img"></div>';

			$title = $prevPost->post_title;
			// $terms = terms_list($nextPost->ID, 'meal-type');
		
			echo '<div class="post-nav__content"><h3>' . $title . '</h3></div>';

			echo '</a>';
			wp_reset_postdata();

		
		} // if

		$nextPost = get_next_post();
		if( $nextPost ) {

			if( has_post_thumbnail( $nextPost->ID ) ) {

				$nextthumbnail = wp_get_attachment_image_src( get_post_thumbnail_id( $nextPost->ID ), 'secondary-thumb' );

				$nextthumbnail = $nextthumbnail[0];

			} else {

				$nextthumbnail = get_stylesheet_directory_uri() . '/dist/images/default.jpg';

			}

			$nextpermalink = get_post_permalink($nextPost->ID);

			echo '<a href="' . $nextpermalink . '" class="col-12 col-sm-12 col-md-6 post-nav__next">';

			setup_postdata( $nextPost ); 

			echo '<div style="background-image:url(' . $nextthumbnail . ')" class="post-nav__img"></div>';

			$title = $nextPost->post_title;
			// $terms = terms_list($nextPost->ID, 'meal-type');
			echo '<div class="post-nav__content"><h3>' . $title . '</h3></div>';
		

			wp_reset_postdata();

			echo '</a>';

			
		} // if

		echo '</div>';

	}


	// Numeric Pagination

	function chomikoo_pagination_nav() {
		global $wp_query;
	 
		$total_pages = $wp_query->max_num_pages;
	 
		if ($total_pages > 1){
			$current_page = max(1, get_query_var('paged'));
	 
			echo paginate_links(array(
				'base' => get_pagenum_link(1) . '%_%',
				'format' => '/page/%#%',
				'current' => $current_page,
				'total' => $total_pages,
				'prev_text'          => __('«'),
				'next_text'          => __('»'),
			));
		}
	}
