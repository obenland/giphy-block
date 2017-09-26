( function( wp, $, _ ) {
	var GIPHY_URL = 'https://api.giphy.com/v1/gifs/search?api_key=Fswo3IBHt0TViFMN6zYgbYzSEb3sLx7I&limit=10&offset=0&rating=G&lang=en&q=';
	var __ = wp.i18n.__;

	wp.blocks.registerBlockType( 'giphy/giphy', {
		title: __( 'Giphy', 'giphy-block' ),
		category: 'embed',
		icon: 'format-image',
		keywords: [ 'gif', 'image', 'meme' ],
		attributes: {
			url: { type: 'string' },
		},

		/**
		 * Renders block in editor.
		 *
		 * @param {object} props Block properties.
		 */
		edit: function edit( props ) {
			var attributes = props.attributes;
			var results = [];

			var fetchGifs = _.debounce( function fetchGifs( search ) {
				if ( attributes.fetching ) {
					return;
				}

				props.setAttributes( {
					fetching: true,
				} );

				$.getJSON( GIPHY_URL + encodeURI( search ) )
					.success( function fetchSuccess( data ) {
						props.setAttributes( {
							fetching: false,
							matches: data.data
						} );
					} )
					.fail( function fetchFail() {
						props.setAttributes( { fetching: false } );
					} );
			}, 1000 );

			if ( attributes.url ) {
				return wp.element.createElement( 'img', { src: attributes.url } );
			} else {

				// If there are results, create thumbnails to select from.
				if ( attributes.matches && attributes.matches.length ) {
					results = _.map( attributes.matches, function mapSearchResults( gif ) {
						var gifImage = wp.element.createElement( 'img', {
							key: gif.id + '-img',
							src: gif.images.fixed_height_small.url,
						} );

						return wp.element.createElement( 'li', {
							key: gif.id,
							onClick: function onClickFetchedGif() {
								props.setAttributes( {
									url: gif.images.original.url
								} );
							}
						}, gifImage );
					} );
				}

				return wp.components.Placeholder( {
					className: 'giphy__placeholder',
					icon: 'format-image',
					label: __( 'Search for the perfect GIF!', 'giphy-block' ),
					children: [
						wp.element.createElement( 'input', {
							type: 'search',
							key: 'search-field',
							placeholder: __( 'Enter Search Term Here', 'giphy-block' ),
							onChange: function onChangeGiphySearch( event ) {
								fetchGifs( event.target.value );
							},
							onKeyUp: function onKeyUpGiphySearch( event ) {
								// If the esc key is pressed, clear out the field and matches.
								if ( event.keyCode === 27 ) {
									event.target.value = '';
									props.setAttributes( {
										matches: [],
									} );
								}
							}
						} ),
						wp.element.createElement( 'div', {
							className: 'giphy__results',
							key: 'results-wrapper'
						}, wp.element.createElement( 'ul', { key: 'results' }, results ) )
					]
				} );
			}
		},

		save: function save( props ) {
			if ( props.attributes.url ) {
				return wp.element.createElement( 'img', { src: props.attributes.url } );
			}

			return null;
		},
	} );


} )( window.wp, window.jQuery, window._ );
