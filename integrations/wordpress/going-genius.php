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
	exit;
}

class Going_Genius_Plugin {

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
		
		add_shortcode( 'gg_login', array( $this, 'render_login_button' ) );
		add_shortcode( 'gg_subscribe', array( $this, 'render_subscribe_button' ) );
		
		// Handle the callback for setup
		add_action( 'init', array( $this, 'handle_oauth_callback' ) );
	}

	public function enqueue_admin_assets( $hook ) {
		if ( 'settings_page_going-genius' !== $hook ) {
			return;
		}
		wp_enqueue_style( 'gg-admin-css', plugin_dir_url( __FILE__ ) . 'assets/css/admin.css', array(), '1.0.0' );
	}

	public function add_admin_menu() {
		add_options_page(
			'Going Genius',
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
		register_setting( 'gg_settings_group', 'gg_access_token' );
		register_setting( 'gg_settings_group', 'gg_app_name' );
	}

	public function handle_oauth_callback() {
		if ( ! isset( $_GET['gg_setup_callback'] ) || ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$code = sanitize_text_field( $_GET['code'] );
		$client_id = get_option( 'gg_app_id' );
		$client_secret = get_option( 'gg_app_secret' );

		if ( ! $code || ! $client_id || ! $client_secret ) {
			return;
		}

		// Final Handshake with Going Genius
		$response = wp_remote_post( 'https://going-genius.com/api/integrations/wordpress/handshake', array(
			'body' => json_encode( array(
				'code' => $code,
				'clientId' => $client_id,
				'clientSecret' => $client_secret,
				'siteUrl' => get_site_url()
			) ),
			'headers' => array( 'Content-Type' => 'application/json' )
		) );

		if ( ! is_wp_error( $response ) ) {
			$data = json_decode( wp_remote_retrieve_body( $response ), true );
			if ( isset( $data['accessToken'] ) ) {
				update_option( 'gg_access_token', $data['accessToken'] );
				update_option( 'gg_app_name', $data['app']['name'] );
				wp_redirect( admin_url( 'options-general.php?page=going-genius&connected=true' ) );
				exit;
			}
		}
	}

	public function render_settings_page() {
		$is_connected = ! empty( get_option( 'gg_access_token' ) );
		$app_name = get_option( 'gg_app_name', 'Not Connected' );
		?>
		<div class="gg-admin-wrap">
			<div class="gg-header">
				<div class="gg-logo-text">GOING<span>GENIUS</span></div>
				<div class="gg-status-badge <?php echo $is_connected ? 'gg-status-connected' : 'gg-status-disconnected'; ?>">
					<span class="dashicons dashicons-<?php echo $is_connected ? 'yes' : 'warning'; ?>"></span>
					<?php echo $is_connected ? 'Connected: ' . esc_html( $app_name ) : 'Not Connected'; ?>
				</div>
			</div>

			<div class="gg-content">
				<?php if ( isset( $_GET['connected'] ) ) : ?>
					<div class="gg-info-box" style="background: #dcfce7; border-left-color: #22c55e; color: #166534;">
						Connection successfully established! Your WordPress site is now synced with Going Genius.
					</div>
				<?php endif; ?>

				<div class="gg-card">
					<div class="gg-card-title">General Settings</div>
					<form method="post" action="options.php">
						<?php settings_fields( 'gg_settings_group' ); ?>
						<div class="gg-field-group">
							<label class="gg-label">App Client ID</label>
							<input type="text" name="gg_app_id" value="<?php echo esc_attr( get_option( 'gg_app_id' ) ); ?>" class="gg-input" placeholder="Enter your Client ID from dashboard" />
						</div>
						<div class="gg-field-group">
							<label class="gg-label">App Client Secret</label>
							<input type="password" name="gg_app_secret" value="<?php echo esc_attr( get_option( 'gg_app_secret' ) ); ?>" class="gg-input" placeholder="Enter your Client Secret" />
						</div>
						<div class="gg-field-group">
							<label class="gg-label">Going Genius API URL</label>
							<input type="text" name="gg_api_url" value="<?php echo esc_attr( get_option( 'gg_api_url', 'https://going-genius.com/api/v1' ) ); ?>" class="gg-input" />
						</div>
						<?php submit_button( 'Save Credentials', 'gg-btn' ); ?>
					</form>
				</div>

				<?php if ( ! empty( get_option( 'gg_app_id' ) ) && ! $is_connected ) : ?>
					<div class="gg-card" style="border-color: #38bdf8; background: #f0f9ff;">
						<div class="gg-card-title">Setup Connection</div>
						<p>Click the button below to authorize this WordPress site with your Going Genius App.</p>
						<?php
						$auth_url = "https://going-genius.com/oauth/authorize?client_id=" . get_option( 'gg_app_id' ) . "&response_type=code&redirect_uri=" . urlencode( admin_url( 'options-general.php?page=going-genius&gg_setup_callback=1' ) );
						?>
						<a href="<?php echo esc_url( $auth_url ); ?>" class="gg-btn gg-btn-primary">Connect to Going Genius</a>
					</div>
				<?php endif; ?>

				<div class="gg-card">
					<div class="gg-card-title">Usage Help</div>
					<p>Use the following shortcodes to integrate buttons into your pages:</p>
					<code>[gg_login]</code> - Renders a premium login button<br><br>
					<code>[gg_subscribe]</code> - Renders a subscription gating button
				</div>
			</div>
		</div>
		<?php
	}

	public function render_login_button( $atts ) {
		$app_id = get_option( 'gg_app_id' );
		if ( ! $app_id ) return '';
		
		$url = "https://going-genius.com/oauth/authorize?client_id=" . $app_id . "&response_type=code&redirect_uri=" . urlencode( home_url( '/gg-callback' ) );
		
		return '<a href="' . esc_url( $url ) . '" class="gg-btn gg-btn-primary">Login with Going Genius</a>';
	}

	public function render_subscribe_button( $atts ) {
		return '<a href="#" class="gg-btn" style="background: #ef4444;">Unlock Premium Content</a>';
	}
}

new Going_Genius_Plugin();
