"""One-time import of extracted WPS cells. Edit the resulting YAML for future updates."""
import json, re, pathlib, datetime, sys
sys.stdout.reconfigure(encoding='utf-8')
ROOT = pathlib.Path(__file__).resolve().parents[1]
raw = json.loads((ROOT/'tools/workbook-extracted.json').read_text(encoding='utf-8'))
out = ROOT/'source/_data'
out.mkdir(exist_ok=True)
URL = re.compile(r'https?://[^\s<>"\u3000\u4e00-\u9fff（）【】]+')
def txt(sheet, cell):
    return sheet['cells'].get(cell, {}).get('text', '')
def cells_for(sheet, row, columns):
    return [(c+str(row),sheet['cells'][c+str(row)]) for c in columns if c+str(row) in sheet['cells']]
def fields(cells):
    result=[]
    for cell,v in cells:
        f={'cell':cell,'text':v['text'],'url':v.get('link')}
        if v.get('formula'):
            m=re.search(r'ID_[A-F0-9]+',v['formula'])
            f['image']=raw['images'].get(m.group()) if m else None
            f['text']=''
        result.append(f)
    return result
def links(fs):
    result=[]
    for f in fs:
        found=([f['url']] if f.get('url') else [])+URL.findall(f['text'])
        for bv in re.findall(r'(?<![/\w])(BV[0-9A-Za-z]{10})',f['text']):found.append('https://www.bilibili.com/video/'+bv+'/')
        for u in found:
            u=u.rstrip('.,，；;')
            if u not in [s['url'] for s in result]:
                host=re.sub(r'^https?://','',u).split('/')[0]
                video=bool(re.search(r'b23.tv|bilibili.com/video|v.douyin|v.qq.com|video.weibo|VIDE|study_style_id=video',u))
                result.append({'url':u,'label':host,'kind':'video' if video else 'source','origin':'原表链接'})
    return result
def date(value):
    if value.isdigit() and 30000<int(value)<60000:
        d=datetime.datetime(1899,12,30)+datetime.timedelta(days=int(value))
        return f'{d.month}月{d.day}日'
    return value
def normalize(t):return t.replace('🍑','周涛').replace('🍉','董卿')
sheet=raw['sheets'][0]; items=[];year=None
inherited={}
for area in sheet['merges']:
    a,b=area.split(':'); ac,ar=re.match(r'([A-Z]+)(\d+)',a).groups();bc,br=re.match(r'([A-Z]+)(\d+)',b).groups()
    if ac==bc:
        for r in range(int(ar)+1,int(br)+1):inherited[f'{ac}{r}']=a
for row in range(3,243):
    if row==169:continue
    fs=fields(cells_for(sheet,row,'ABCDEFGHIJK'))
    if not fs:continue
    a=txt(sheet,'A'+str(row))
    if re.match(r'\d{4}年',a):year=int(a[:4])
    rowyear=None if a=='未知' else year
    def get(c):return txt(sheet,c+str(row)) or txt(sheet,inherited.get(c+str(row),''))
    tags=[]
    for col,key in [('E','zhou'),('F','dong'),('D','together'),('C','moments')]:
        if get(col) and not URL.fullmatch(get(col).strip()):tags.append(key)
    if 'together' in tags:
        tags=list(dict.fromkeys(tags+['zhou','dong']))
    summaries=[{'label':label,'text':get(c)} for c,label in [('D','共同记录'),('E','周涛'),('F','董卿')] if get(c) and not URL.fullmatch(get(c).strip())]
    title=normalize(next((s['text'].split('\n')[0] for s in summaries),'原表编者观察' if get('C') else '日期记录（原表未填写事件）'))
    # An editorial observation remains an attributed source text, never a new biographical assertion.
    editorial_rows=[14,40,67,68,80,117,125,136,148,150,155,156,158,160,161,163,166,176,178,185,194,201,202,208,211,212,214,215,216,225,229,230,231,233,235,236,237,238,239,240,241,242]
    if row in [67,80,160,161,185,201,211,225,229]:title='原表线索记录 · 待核实'
    inherited_fields=[]
    for c in 'BCDEFGHIJK':
        anchor=inherited.get(c+str(row))
        if anchor and anchor in sheet['cells']:inherited_fields+=fields([(anchor,sheet['cells'][anchor])])
    allfs=fs+inherited_fields
    item={'id':f't{row:03}','row':row,'year':rowyear,'date':date(get('B')) or '日期未详','title':title[:90],'tags':tags,'summaries':summaries,'observation':get('C'),'editorial':row in editorial_rows,'fields':fs,'inherited_fields':inherited_fields,'sources':links(allfs),'images':list(dict.fromkeys(f['image'] for f in allfs if f.get('image'))),'checks':[]}
    items.append(item)
interviews=[];s=raw['sheets'][1]
for key,cols,titlecol,summarycol in [('zhou','ABCDE','B','A'),('dong','GHIJK','H','G'),('together','MNOPQ','N','M')]:
    for row in range(5,45):
        fs=fields(cells_for(s,row,cols))
        if not fs:continue
        title=txt(s,titlecol+str(row)); dt='日期未详'
        if title.isdigit():
            d=datetime.datetime(1899,12,30)+datetime.timedelta(days=int(title));dt=d.strftime('%Y-%m-%d');title=txt(s,summarycol+str(row))
        else:
            years=re.findall(r'(?:19|20)\d{2}',title)
            if years:dt=' / '.join(dict.fromkeys(years))
        interviews.append({'id':f'i-{key}-{row}','person':key,'date':dt,'year':int(dt[:4]) if dt[:4].isdigit() else None,'title':title,'description':txt(s,summarycol+str(row)),'fields':fs,'sources':links(fs),'images':[f['image'] for f in fs if f.get('image')],'checks':[]})
def save(name,value):
    (out/(name+'.yml')).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
save('timeline',items);save('interviews',interviews)
save('archive',{'title':'年年岁岁人依旧','subtitle':'董卿 × 周涛 · 人物资料馆','timeline_preface':txt(sheet,'A1'),'timeline_interlude':txt(sheet,'A169'),'interview_preface':txt(s,'A2'),'reading':txt(s,'B1'),'reading_title':'植物，就是故乡','source_file':'年年岁岁人依旧.xlsx','image_count':len(raw['images'])})
print(f'Imported {len(items)} timeline rows; {len(interviews)} interviews; {len(raw["images"])} images.')
