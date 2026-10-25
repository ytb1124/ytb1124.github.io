"""Build the English L-ISA Studio report from the committed translation.

Requires reportlab. Set LISA_REPORT_FONT_DIR to a directory containing
DejaVuSans.ttf, DejaVuSans-Bold.ttf, DejaVuSans-Oblique.ttf, and DejaVuSansMono.ttf.
"""
import os
import re
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Preformatted, CondPageBreak

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_FONTS = Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies/native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype'
FONTS = Path(os.environ.get('LISA_REPORT_FONT_DIR', str(DEFAULT_FONTS)))
for family, filename in [('Report','DejaVuSans.ttf'),('Report-Bold','DejaVuSans-Bold.ttf'),('Report-Italic','DejaVuSans-Oblique.ttf'),('Mono','DejaVuSansMono.ttf')]:
    pdfmetrics.registerFont(TTFont(family, str(FONTS/filename)))
pdfmetrics.registerFontFamily('Report', normal='Report', bold='Report-Bold', italic='Report-Italic', boldItalic='Report-Bold')
WIDTH = A4[0]-38*mm
body = ParagraphStyle('Body', fontName='Report', fontSize=9.3, leading=14.1, spaceAfter=8, splitLongWords=True)
small = ParagraphStyle('Small', parent=body, fontSize=7.7, leading=11, textColor=colors.HexColor('#555555'))
title = ParagraphStyle('Title', parent=body, fontName='Report-Bold', fontSize=21, leading=27, spaceAfter=15)
heading = ParagraphStyle('Heading', parent=body, fontName='Report-Bold', fontSize=13, leading=18, spaceBefore=16, spaceAfter=8, keepWithNext=True)
subheading = ParagraphStyle('Subheading', parent=heading, fontSize=10.5, leading=15, spaceBefore=12)
caption = ParagraphStyle('Caption', parent=small, fontName='Report-Bold', spaceBefore=9, spaceAfter=5, keepWithNext=True)
cell = ParagraphStyle('Cell', fontName='Report', fontSize=7.1, leading=10, splitLongWords=True)
code = ParagraphStyle('Code', fontName='Mono', fontSize=7.8, leading=11.5, backColor=colors.HexColor('#f3f4f5'), borderPadding=7, spaceBefore=5, spaceAfter=12)
list_style = ParagraphStyle('List', parent=body, leftIndent=12, firstLineIndent=-10, spaceAfter=6)

def inline(text):
    text = escape(text)
    text = re.sub(r'`([^`]+)`', r'<font name="Mono" size="7.6">\1</font>', text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    return text

story = []
lines = (ROOT/'content/reports/l-isa-studio-report-en.md').read_text().splitlines()
i = 0
while i < len(lines):
    line = lines[i].strip()
    if not line:
        i += 1
        continue
    if line.startswith('```'):
        block = []
        i += 1
        while i < len(lines) and not lines[i].startswith('```'):
            block.append(lines[i])
            i += 1
        assert all(len(x) <= 100 for x in block), block
        if story:
            story[-1].keepWithNext = True
        story.append(Preformatted('\n'.join(block), code))
        i += 1
        continue
    if line.startswith('|'):
        rows = []
        while i < len(lines) and lines[i].strip().startswith('|'):
            cells = [v.strip() for v in lines[i].strip().strip('|').split('|')]
            if not all(re.fullmatch(r':?-+:?', v) for v in cells):
                rows.append(cells)
            i += 1
        n = len(rows[0])
        assert all(len(row) == n for row in rows)
        if n == 8: ratios = [.245,.19,.07,.08,.08,.08,.09,.165]
        elif n == 7: ratios = [.29,.09,.13,.09,.09,.09,.22] if rows[0][0]=='Test' else [.29,.15,.09,.09,.11,.16,.11]
        elif n == 6: ratios = [.43,.16,.10,.11,.10,.10]
        elif n == 5: ratios = [.55,.11,.12,.11,.11]
        elif n == 4: ratios = [.17,.30,.28,.25]
        else: ratios = [.31,.69]
        widths = [WIDTH*r/sum(ratios) for r in ratios]
        formatted = []
        for row_index, row in enumerate(rows):
            formatted_row = []
            for column, value in enumerate(row):
                style = cell
                if row_index == 0 or re.fullmatch(r'[<>=+\-\d.:/]+', value):
                    size = min(7.1, 7.1*(widths[column]-10)/max(1,pdfmetrics.stringWidth(value,'Report',7.1)))
                    style = ParagraphStyle('UnbrokenCell',parent=cell,fontSize=size,splitLongWords=False)
                formatted_row.append(Paragraph(inline(value), style))
            formatted.append(formatted_row)
        table = Table(formatted, colWidths=widths, repeatRows=1, hAlign='LEFT')
        table.setStyle(TableStyle([
            ('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e9edf0')),
            ('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f8f9fa')]),
            ('LINEABOVE',(0,0),(-1,0),.7,colors.HexColor('#52616b')),
            ('LINEBELOW',(0,0),(-1,0),.5,colors.HexColor('#52616b')),
            ('LINEBELOW',(0,-1),(-1,-1),.5,colors.HexColor('#52616b')),
            ('VALIGN',(0,0),(-1,-1),'TOP'),
            ('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),
            ('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),
        ]))
        story.extend([table, Spacer(1,9)])
        continue
    if line.startswith('# '):
        story.append(Paragraph(inline(line[2:]), title))
    elif line.startswith('### '):
        story.append(Paragraph(inline(line[4:]), subheading))
    elif line.startswith('## '):
        story.append(CondPageBreak(175))
        story.append(Paragraph(inline(line[3:]), heading))
    elif re.match(r'^(\d+\. |\- )',line):
        story.append(Paragraph(inline(line), list_style))
    else:
        paragraph = line
        while i+1 < len(lines) and lines[i+1].strip() and not re.match(r'^(#|\||```|\d+\. |\- )',lines[i+1]):
            i += 1
            paragraph += ' '+lines[i].strip()
        style = caption if line.startswith('**Table ') else small if line.startswith(('Taebin Yoo |','Tested components:','English translation prepared')) else body
        story.append(Paragraph(inline(paragraph), style))
    i += 1

out = ROOT/'output/pdf/l-isa-renderer-report-en.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(out), pagesize=A4, leftMargin=19*mm, rightMargin=19*mm, topMargin=21*mm, bottomMargin=19*mm, title='L-ISA Studio: Black-Box Identification of Object Rendering', author='Taebin Yoo', subject='English translation of Revision 1.1: gain, frequency response, delay, and prediction validation')
def decorate(canvas, document):
    canvas.saveState()
    canvas.setFillColor(colors.HexColor('#667580'))
    canvas.setFont('Report',6.7)
    canvas.drawString(19*mm,A4[1]-12*mm,'L-ISA STUDIO / BLACK-BOX SYSTEM IDENTIFICATION')
    canvas.drawString(19*mm,10*mm,'Taebin Yoo | Revision 1.1 | English translation')
    canvas.drawRightString(A4[0]-19*mm,10*mm,str(document.page))
    canvas.restoreState()
doc.build(story, onFirstPage=decorate, onLaterPages=decorate)
print(out)
