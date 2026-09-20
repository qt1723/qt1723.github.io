'use strict';
hexo.extend.helper.register('safe_url', s => /^https?:\/\//i.test(s || '') ? s : '#');
hexo.extend.helper.register('tag_label',s=>({zhou:'🍑 周涛',dong:'🍉 董卿',together:'🌺 共同',moments:'✨ 名场面'}[s]||s));
