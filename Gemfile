#rails new . -d postgresql -T -J
source 'http://rubygems.org'

gem 'rails', '3.2.1'

##### ActiveRecord #####
#gem 'pg'
group :production do
  gem 'pg'
  gem 'therubyracer' 
end
group :development, :test do
  gem 'sqlite3'
end
gem 'devise', '~> 1.4.9'
gem "sass-rails" # it will throw exception if put in assets http://j.mp/oj7y6K
gem 'activeadmin'

#use unicorn as web server
gem 'unicorn'

gem 'default_value_for'
gem 'sunspot_rails',  "~> 1.3.0.rc6"

gem 'active_hash' # 用于保存配置型(枚举)记录
gem 'kaminari' # 分页
#Image processing
gem 'dragonfly', ' ~> 0.9.8'
gem 'rack-cache', require: 'rack/cache'
gem 'liquid','~> 2.3.0' #template language
gem "carrierwave"
#Query
#gem 'meta_where'
gem 'meta_search', '~> 1.1.1'
gem 'squeel'

#gem 'carmen'#地区
gem 'carmen', git: "git://github.com/jim/carmen.git"
gem 'seedbank' # 分离出各个环境下的seed
#gem 'gravtastic' #gravtastic头像服务,现在没有这服务了

##### Controller related #####
gem 'decent_exposure'
gem 'sentient_user' # 将current_user设置至线程中
gem "mini_magick" # 调用参数说明:http://www.imagemagick.org/Usage/

##### View related #####
gem 'haml'
gem 'message_block' #用于显示错误信息
gem 'client_side_validations' #客户端校验
gem 'therubyracer', require: nil unless ENV['TRAVIS'] # 编译coffee-script # 安装编译过程太慢(大概需要4分钟)

##### 其他 #####
gem "activemerchant" # 支付
gem "activemerchant_patch_for_china", git: "git://github.com/saberma/activemerchant_patch_for_china.git" # 支持多个支付帐户(待完成其他财付通等类型后再send pull request)
gem "httparty"
#gem "resque" # 后台任务
gem "resque", git: 'git://github.com/defunkt/resque.git' # 1.19.0之后的版本才支持后台运行
gem "resque-scheduler", git: 'git://github.com/bvandenbos/resque-scheduler.git' # 最新版本才支持后台运行
gem "chinese_pinyin" # 汉字转拼音
gem "nokogiri" # 解释模板config/settings.html
gem "uuid" # 生成36位(或32位)唯一序列号
gem 'settingslogic' #用于解析一些配置信息
#gem 'rack-perftools_profiler', :require => 'rack/perftools_profiler'
gem 'grit', git: 'git://github.com/mojombo/grit.git' # 主题版本控制(每个商店主题都是一个git repository) # 2.4.1版本存在此问题 http://j.mp/uoEKw1
gem 'oauth2' # 提供访问oauth provider的客户端访问接口,服务端(Provider)使用http://j.mp/nCZiUj, 代码放在 lib/oauth2
#gem 'newrelic_rpm' # 性能监控(模板编辑器中的layout/theme.liquid也会被注入script,暂时不使用此gem)
gem "jquery-rails"
gem 'rubyzip' # 解压缩用户上传的主题zip文件
gem 'gollum', git: 'git://github.com/saberma/gollum.git'  #用于wiki系统，1.3.1需要安装Pygments http://j.mp/uHMN1L，开发版本使用payments.rb，但有waring提示'did not have a valid gemspec'
gem 'RedCloth'
gem 'sitemap_generator' # 生成搜索引擎友好的sitemap # bundle exec rake sitemap:refresh:no_ping

group :development do
  gem 'rails3-generators'
  gem "haml-rails"
  gem 'guard'
  gem 'guard-livereload' # 修改后台文件后，safari或chrome浏览器会自动刷新
  gem 'guard-rspec'
  gem 'guard-spork'
  #gem 'ruby-debug19', platforms: :ruby_19 # To use debugger(add 'debugger' in code, then set autoeval; set autolist in console)
  # gem 'rails-dev-boost', git: 'git://github.com/thedarkone/rails-dev-boost.git', require: 'rails_development_boost' # 加快开发时的响应速度
  gem 'capistrano'
  gem "letter_opener", git: 'git://github.com/ryanb/letter_opener.git'
end

group :development, :test do
  unless ENV['TRAVIS'] # 特殊处理，去掉在travis-ci中不需要的gem
    gem "awesome_print", require: 'ap' # 调试
    gem "interactive_editor"
    gem 'sunspot_solr'
  end
  gem "factory_girl"
  gem "factory_girl_rails"
end

group :test do
  gem "selenium-webdriver", "~> 2.14.0" # 支持travis-ci的firefox8.0版本(但存在session未被清空的问题)
  gem "rspec-rails"
  gem 'capybara' , ' ~> 1.1.2'
  gem 'resque_spec' # resque测试
  gem 'database_cleaner' # 保持数据库处理干净状态
  gem 'spork' # 为测试加速的drb server(spork spec &)
end

group :production do
  gem 'memcache-client'
end

# Gems used only for assets and not required
# in production environments by default.
# rake assets:precompile 部署到生产环境下执行
group :assets do
  gem 'coffee-rails'
  gem 'uglifier'
end
