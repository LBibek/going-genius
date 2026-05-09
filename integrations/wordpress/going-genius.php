<?php
/**
 * Plugin Name: Going Genius Integration
 * Plugin URI: https://going-genius.com
 * Description: Seamlessly integrate Going Genius identity and billing into WordPress.
 * Version: 0.1.0
 * Author: Going Genius Team
 * Author URI: https://going-genius.com
 * License: GPL2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Going_Genius_Plugin {

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_shortcode( 'gg_login', array( $this, 'render_login_button' ) );
		add_shortcode( 'gg_subscribe', array( $this, 'render_subscribe_button' ) );
	}

	public function add_admin_menu() {
		add_options_page(
			'Going Genius Settings',
			'Going Genius',
			'manage_options',
			'going-genius',
			array( $this, 'render_settings_page' )
		);
	}

	public function register_settings() {
		register_setting( 'gg_settings_group', 'gg_app_id' );
		register_setting( 'gg_settings_group', 'gg_app_secret' );
		register_setting( 'gg_settings_group', 'gg_api_url' );
	}

	public function render_settings_page() {
		?>
		<div class="wrap">
			<h1>Going Genius Settings</h1>
			<form method="post" action="options.php">
				<?php settings_fields( 'gg_settings_group' ); ?>
				<?php do_settings_sections( 'gg_settings_group' ); ?>
				<table class="form-table">
					<tr valign="top">
						<th scope="row">App ID</th>
						<td><input type="text" name="gg_app_id" value="<?php echo esc_attr( get_option( 'gg_app_id' ) ); ?>" class="regular-text" /></td>
					</tr>
					<tr valign="top">
						<th scope="row">App Secret</th>
						<td><input type="password" name="gg_app_secret" value="<?php echo esc_attr( get_option( 'gg_app_secret' ) ); ?>" class="regular-text" /></td>
					</tr>
					<tr valign="top">
						<th scope="row">API URL</th>
						<td><input type="text" name="gg_api_url" value="<?php echo esc_attr( get_option( 'gg_api_url', 'https://going-genius.com/api/v1' ) ); ?>" class="regular-text" /></td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	public function render_login_button( $atts ) {
		$app_id = get_option( 'gg_app_id' );
		if ( ! $app_id ) {
			return 'Going Genius: Please configure App ID in settings.';
		}
		
		$url = "https://going-genius.com/oauth/authorize?client_id=" . $app_id . "&response_type=code&redirect_uri=" . urlencode( home_url( '/gg-callback' ) );
		
		return '<a href="' . esc_url( $url ) . '" class="gg-login-button" style="background: #000; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Login with Going Genius</a>';
	}

	public function render_subscribe_button( $atts ) {
		// Placeholder for subscription logic
		return '<button class="gg-subscribe-button">Subscribe with Going Genius</button>';
	}
}

new Going_Genius_Plugin();
