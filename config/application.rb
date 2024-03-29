require File.expand_path('../boot', __FILE__)
require 'rails/all'
require "rack/ssl"

# If you have a Gemfile, require the gems listed there, including any gems
# you've limited to :test, :development, or :production.
if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  Bundler.require *Rails.groups(:assets => %w(development test))
  # If you want your assets lazily compiled in production, use this line
  #Bundler.require(:default, :assets, Rails.env)
end


module Shopqi
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    config.autoload_paths += %W(
      #{config.root}/lib
      #{config.root}/app/middlewares
    )

    #set the generator method auto generate helper false
    config.generators.helper = false

    #set the time zone to china
    config.time_zone = "Beijing"

    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named.
    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

    # Activate observers that should always be running.
    # config.active_record.observers = :cacher, :garbage_collector, :forum_observer
    config.active_record.observers = :shop_observer, :smart_collection_observer, :product_observer, :theme_observer, :order_observer,:activity_observer

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    config.i18n.default_locale = :cn
    config.i18n.locale = :cn

    # JavaScript files you want as :defaults (application.js is always included).
    #backbone_js = %w(jquery.min rails handlebars underscore-min backbone-min backbone.rails plugins)
    #config.action_view.javascript_expansions[:defaults] = %w()
    #config.action_view.javascript_expansions[:backbone] = backbone_js # 官网注册
    #config.action_view.javascript_expansions[:admin] = backbone_js + %w(jquery-ui-1.8.14.custom.min rails.validations jquery.blockUI plugins/jquery.guide admin_application )
    #config.action_view.javascript_expansions[:theme] = backbone_js + %w(theme_application) # 仅用于主题商店列表


    # Configure generators values. Many other options are available, be sure to check the documentation.
    config.generators do |g|
      g.template_engine :haml
      g.test_framework :rspec, :fixture => true, :views => false
      g.fixture_replacement :factory_girl, :dir => "spec/factories"
    end

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password,:password_confirmation]

    #enable the asset pipline
    config.assets.enabled = true

    #diable automatic stylesheet/javascript generation
    config.generators.stylesheets = false
    config.generators.javascripts = false

    config.middleware.insert 0, 'Rack::Cache', {
      :verbose     => false,
      :metastore   => URI.encode("file:#{Rails.root}/tmp/dragonfly/cache/meta"),
      :entitystore => URI.encode("file:#{Rails.root}/tmp/dragonfly/cache/body")
    }  unless Rails.env.production?  ## uncomment this 'unless' in Rails 3.1,
                                      ## because it already inserts Rack::Cache in production
    config.middleware.insert_after 'Rack::Cache', 'Dragonfly::Middleware', :images
    
    #config.middleware.use ::Rack::PerftoolsProfiler, :default_printer => 'gif', :bundler => true, :mode => :walltime # 开发环境下性能测试
  end
end
