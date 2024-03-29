#encoding: utf-8
module LiquidDropHelper

  #由于liquid的hash只能是'key' => value形式
  #所以,key写成string的形式
  def as_json(options={})
    result = {}
    keys = self.public_methods(false)
    keys = keys - [:as_json, :options]
    keys.inject(result) do |result, method|
      result[method.to_s] = self.send(method)
      result
    end
    result
  end

end

Liquid::Drop.send :include , LiquidDropHelper

#Carmen.default_locale = :cn
Carmen.i18n_backend.locale = :zh_CN

# 修正:DEPRECATION WARNING: Setting :expires_in on read has been deprecated in favor of setting it on write
def smart_fetch(name, options = {}, &blk)
  in_cache = Rails.cache.fetch(name)
  return in_cache if in_cache
  if block_given?
    val = yield
    Rails.cache.write(name, val, options)
    return val
  end
end
