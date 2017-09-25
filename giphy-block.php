<?php
/**
 * Plugin Name: Giphy Block
 * Plugin URI: https://github.com/obenland/giphy-block
 * Description: A Gutenberg Block for Giphy Awesomeness.
 * Author: Konstantin Obenland
 * Version: 1
 */

function giphy_enqueue_block_editor_assets() {
	wp_enqueue_script( 'giphy-block', plugins_url( 'block.js', __FILE__ ), array(
		'wp-blocks',
		'wp-i18n',
		'wp-element',
	), time() );

	wp_enqueue_style( 'giphy-block', plugins_url( 'editor.css', __FILE__ ), array( 'wp-blocks' ), time() );
}
add_action( 'enqueue_block_editor_assets', 'giphy_enqueue_block_editor_assets' );
