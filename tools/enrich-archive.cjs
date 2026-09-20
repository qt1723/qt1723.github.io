const fs = require('fs');
const yaml = require('js-yaml');
const base = 'source/_data/';
const rows = JSON.parse(fs.readFileSync(base+'timeline.yml','utf8'));
const interviews = JSON.parse(fs.readFileSync(base+'interviews.yml','utf8'));
function add(ids, url, label, scope, kind='source') {
  ids.forEach(row => rows.find(x=>x.row===row).sources.push({url,label,kind,origin:'补充公开来源',scope}));
}
add([3,12,38], 'https://www.iq.com/actor-info/%E5%91%A8%E6%B6%9B-zhou-tao-214380105?lang=zh_cn','爱奇艺 · 周涛人物资料','出生信息、北京电视台工作经历与星光奖；不证明原表所有细节。');
add([5,13,23,41], 'https://shaoer.cctv.com/2016/08/30/ARTITyTgyALctaivAQjOrdEA160830.shtml','央视网 · 董卿主持人介绍','出生日期、浙江电视台与上海卫视经历、2004年青歌赛。');
add([5,27,58,79,85,134], 'https://tv.cctv.com/2016/03/31/ARTImBd1l7BLqbxhtsLDRI4D160331.shtml','央视网 · 董卿个人信息','职业履历、金话筒获奖、上戏MFA毕业、国庆晚会与访学经历；私人生活不在此来源支持范围内。');
add([11], 'https://finance.people.com.cn/money/n/2013/0311/c218900-20746433.html','人民网 · 周涛成长经历','1986年报考经历。');
add([23], 'https://media.people.com.cn/n1/2016/1121/c40606-28882528.html','人民网 · 周涛转型演出策划','1999年金皇冠奖；不支持原表杂志内容。');
add([25,27], 'https://kejiao.cntv.cn/program/aizibing/20121129/100158.shtml','央视网 · 周涛','主持《综艺大观》五年，2001年开办《真情无限》。');
add([44,57], 'https://www.cctv.com/anchor/compere/0110/profile.shtml','央视网 · 董卿简历','记载2005—2007年春节歌舞晚会、元宵晚会等主持经历；不单独证明周涛同台细节。');
add([47], 'https://www.cctv.com/anchor/20050622/100692.shtml','央视网转载南方周末 · 周涛专访','借调奥组委经历；原表所列月份仍待核。');
add([49], 'https://www.cctv.com/anchor/20050916/101084.shtml','央视网转载人民网 · 周涛','2005年怀孕报道；不能据此确认原表出生日期。');
add([66], 'https://cctvenchiridion.cctv.com/20080222/101642.shtml','央视网 · 2008元宵晚会','节目资料与播出日期；同台人员细节以视频为准。','video');
add([74], 'https://ent.cctv.com/20090211/101737_20.shtml','央视网 · 周涛','报道任命发生在2009年春节后，与原表一月表述有差异。');
add([77], 'https://ent.sina.com.cn/pc/2009-01-14/316/43/index.shtml','新浪 · 2009央视春晚专题','2009年春晚图文及视频资料。');
add([78], 'https://ent.cctv.com/20090209/108854_1.shtml','央视网 · 2009元宵晚会图集','2009元宵晚会现场资料。');
add([88], 'https://www.cflac.org.cn/zt/2010-01/17/content_18788344.htm','中国文联 · 百花迎春演出现场','图注明确列出董卿、周涛等主持人。');
add([97,98], 'https://ent.sina.com.cn/y/2010-09-07/03003078366.shtml','新浪 · 音乐盛典发布会','9月6日发布会出席及主持阵容。');
add([128], 'https://kejiao.cntv.cn/special/zgmydh/','央视网 · 中国谜语大会','董卿出题内容；录制时间推断未核实。');
add([135], 'https://culture.people.com.cn/n/2014/0607/c87423-25117106-2.html','人民网 · 好声音美国赛区','董卿担任美国赛区评委。');
add([137], 'https://media.people.com.cn/n/2015/0219/c14677-26583335.html','人民网 · 董卿回归春晚','2015年回归春晚；不证明原表彩排精确日期。');
add([139,141], 'https://www.xinhuanet.com/world/2015-07/01/c_127970261.htm','新华网 · 董卿结束学业回国','2015年7月1日报道其回国及即将参与节目。');
add([141], 'https://1118.cctv.com/2015/07/08/ARTI1436322198646898.shtml','央视网 · 董卿重回央视','《挑战不可能》发布与节目安排。');
add([153], 'https://www.xinhuanet.com/politics/2016lh/zhibo/20160314b/','新华网 · 全国政协闭幕会','仅核对会议日期为2016年3月14日，不独立证明个人出席。');
add([165], 'https://www.chinanews.com.cn/m/yl/2018/05-07/8507436.shtml','中新网 · 周涛以新身份归来','2016年调入北京演艺集团。');
add([175,188], 'https://culture.people.com.cn/GB/n1/2018/0507/c1013-29967669.html','人民网 · 朗读者第二季','第一季2017年2月18日、第二季2018年5月5日首播。');
add([205], 'https://www.thepaper.cn/newsDetail_forward_5294471','澎湃新闻 · 声临其境第三季','周涛加盟节目主持。');
add([228], 'https://www.iq.com/actor-info/%E5%91%A8%E6%B6%9B-zhou-tao-214380105?lang=zh_cn','爱奇艺 · 周涛人物资料','董事长职务可核对，2022年10月任命时间尚待官方材料。');
add([234], 'https://news.iqilu.com/shandong/yuanchuang/2025/0108/5765632.shtml','齐鲁网 · 2025山东春晚','2025年1月8日官宣加盟。');
const notes = {
  5:'原表记“上海市崇明区”；央视个人信息记“上海市闸北区”。主页仅使用“上海”，原表文字保留供对照。',
  27:'原表记“第五届金话筒”；央视早期个人简历记2001年第六届。年份与获奖事实可核对，届次存在差异。',
  39:'原表日期为2004年2月29日；此处暂不将该日期作为已核实的春晚播出日期。',
  74:'原表写1月，央视2009年2月报道写“牛年春节刚过”获任命。',
  153:'Excel数值的月日为3月12日；新华社会议直播记闭幕会为3月14日。原表日期保留。',
  167:'原表写“第九届文代会”，与同年另一条“第十次全国代表大会”不一致，届次待核。',
  213:'原表归入2020年并写《朗读者第三季》杀青；日期和季次暂未获得可靠资料确认。'
};
rows.forEach(r=>{
 if(notes[r.row])r.checks.push(notes[r.row]);
 if(!r.sources.length)r.checks.push('尚未找到可确认本条全部细节的可靠公开链接；原表文字与配图保留，待补充核实。');
 if(r.editorial)r.checks.push('本条含原表编者解读或未证实线索，请与公开报道区分；不据此判断私人关系。');
});
// Preserve misplaced entries in the workbook's joint column without claiming a joint appearance.
interviews.filter(x=>x.person==='together'&&x.id!=='i-together-6').forEach(x=>x.checks.push('原表归在共同访谈栏；本条为延伸阅读，并非已确认两人共同受访。'));
interviews.find(x=>x.id==='i-zhou-9').checks.push('原表链接仅指向新浪娱乐首页，尚缺文章直达地址。');
for(const [name,value] of [['timeline',rows],['interviews',interviews],['archive',JSON.parse(fs.readFileSync(base+'archive.yml','utf8'))]])fs.writeFileSync(base+name+'.yml',yaml.dump(value,{lineWidth:110,noRefs:true,quotingType:'"'}));
console.log('Enriched',rows.filter(x=>x.sources.some(s=>s.origin==='补充公开来源')).length,'timeline rows.');
