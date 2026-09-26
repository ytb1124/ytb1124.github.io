"""Generate bilingual report PDFs and vector equations from the shared manuscript.

Requires reportlab, matplotlib, svglib. Override SOUNDXR_KOREAN_FONT with a
Korean TTF/TTC on other machines. Photographs remain committed source assets.
"""
import json
import os
from pathlib import Path
from xml.sax.saxutils import escape
import matplotlib
matplotlib.use('Agg')
from matplotlib import mathtext, rcParams
from matplotlib.font_manager import FontProperties
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from svglib.svglib import svg2rlg

ROOT=Path(__file__).resolve().parents[1]
STUDY=json.loads((ROOT/'content/sound-xr-image-study.json').read_text())
OUT=ROOT/'public/reports'
FONT=os.environ.get('SOUNDXR_KOREAN_FONT','/System/Library/AssetsV2/com_apple_MobileAsset_Font7/bad9b4bf17cf1669dde54184ba4431c22dcad27b.asset/AssetData/NanumGothic.ttc')

def text(s):
    return escape(s.replace('−','-').replace('–','-').replace('—','-'))

def build_equations():
    (OUT/'equations').mkdir(parents=True,exist_ok=True)
    rcParams.update({'mathtext.fontset':'stix','svg.fonttype':'path','svg.hashsalt':'soundxr-report-v2'})
    for section in STUDY['en']['sections']:
        for eq in section['equations']:
            mathtext.math_to_image('$'+eq['latex']+'$',ROOT/'public'/eq['src'].lstrip('/'),
                                  prop=FontProperties(size=16),format='svg',color='black')
            svg=ROOT/'public'/eq['src'].lstrip('/')
            svg.write_text('\n'.join(line.rstrip() for line in svg.read_text().splitlines())+'\n')

def build_pdf(locale):
    r=STUDY[locale]
    if locale=='ko':
        pdfmetrics.registerFont(TTFont('Korean',FONT,subfontIndex=0))
        regular=bold='Korean'
    else:
        regular,bold='Times-Roman','Times-Bold'
    width=A4[0]-46*mm
    body=ParagraphStyle('Body',fontName=regular,fontSize=10,leading=15,spaceAfter=9,wordWrap='CJK' if locale=='ko' else None)
    title=ParagraphStyle('Title',parent=body,fontName=bold,fontSize=23,leading=29,spaceAfter=13)
    subtitle=ParagraphStyle('Subtitle',parent=body,fontSize=11,leading=16,textColor=colors.HexColor('#555555'),spaceAfter=12)
    heading=ParagraphStyle('Heading',parent=body,fontName=bold,fontSize=13,leading=18,spaceBefore=16,spaceAfter=9,keepWithNext=True)
    small=ParagraphStyle('Small',parent=body,fontSize=8,leading=11,textColor=colors.HexColor('#555555'))
    cell=ParagraphStyle('Cell',parent=small,textColor=colors.black,fontSize=8,leading=11)
    doc=SimpleDocTemplate(str(OUT/f'sound-xr-image-renderer-report-{locale}.pdf'),pagesize=A4,
       leftMargin=23*mm,rightMargin=23*mm,topMargin=23*mm,bottomMargin=21*mm,
       title=r['title'],author='Taebin Yoo')
    title_text=text(r['title']).replace('Sound xR Image 공간','Sound xR Image<br/>공간') if locale=='ko' else text(r['title'])
    story=[Paragraph(title_text,title),Paragraph(text(r['subtitle']),subtitle),
       Paragraph('Taebin Yoo  |  '+STUDY['metadata']['date']+'  |  Revision '+STUDY['metadata']['revision'],small),
       Paragraph('초록' if locale=='ko' else 'Abstract',heading),Paragraph(text(r['abstract']),body),
       Paragraph(('주요어  ' if locale=='ko' else 'Keywords  ')+text(' · '.join(r['keywords'])),small)]
    for s in r['sections']:
        story.append(Paragraph(text(s['heading']),heading))
        paragraph_style=small if s['heading'] in ['자료와 재현성','Sources and reproducibility'] else body
        story.extend(Paragraph(text(p),paragraph_style) for p in s['paragraphs'])
        for eq in s['equations']:
            drawing=svg2rlg(str(ROOT/'public'/eq['src'].lstrip('/')))
            scale=min(1,(width-30)/drawing.width)
            drawing.scale(scale,scale)
            drawing.width*=scale
            drawing.height*=scale
            table=Table([[drawing,Paragraph('('+str(int(eq['id']))+')',small)]],colWidths=[width-26,26])
            table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'MIDDLE'),('ALIGN',(0,0),(0,0),'CENTER'),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)]))
            story.append(table)
        for t in s['tables']:
            rows=[[Paragraph(text(str(v)),cell) for v in row] for row in [t['columns']]+t['rows']]
            first=width*.37 if len(t['columns'])==5 else width*.20
            tab=Table(rows,colWidths=[first]+[(width-first)/(len(t['columns'])-1)]*(len(t['columns'])-1),repeatRows=1)
            tab.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#eeeeee')),('LINEABOVE',(0,0),(-1,0),.8,colors.black),('LINEBELOW',(0,0),(-1,0),.4,colors.black),('LINEBELOW',(0,-1),(-1,-1),.8,colors.black),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
            story.append(KeepTogether([Spacer(1,8),Paragraph(text(t['caption']),small),tab,Spacer(1,8)]))
    def decorate(canvas,document):
        canvas.saveState()
        canvas.setFont('Helvetica',7)
        canvas.setFillColor(colors.HexColor('#666666'))
        canvas.drawString(23*mm,A4[1]-13*mm,'SOUND xR IMAGE / EXPERIMENTAL RESEARCH REPORT')
        canvas.drawString(23*mm,12*mm,'Taebin Yoo / Revision 2.0')
        canvas.drawRightString(A4[0]-23*mm,12*mm,str(document.page))
        canvas.restoreState()
    doc.build(story,onFirstPage=decorate,onLaterPages=decorate)
    print(f'Built {locale} report')

if __name__=='__main__':
    build_equations()
    for locale in ['ko','en']:build_pdf(locale)
