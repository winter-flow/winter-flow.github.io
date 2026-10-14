from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

root = Path(__file__).parent

class Check(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.hrefs = []
        self.stack = []
        self.errors = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'a':
            self.hrefs.append(attrs.get('href', ''))
        if tag not in {'meta','link','img','br','hr','input','source','area','base','embed','wbr'}:
            self.stack.append(tag)
    def handle_endtag(self, tag):
        if tag in self.stack:
            while self.stack:
                top = self.stack.pop()
                if top == tag:
                    break
                self.errors.append(f'unclosed {top} before {tag}')
        else:
            self.errors.append(f'unexpected closing {tag}')

check = Check()
check.feed((root / 'index.html').read_text(encoding='utf-8'))
missing = []
for href in check.hrefs:
    if href.startswith('#'):
        if href[1:] not in check.ids and href[1:] != 'news':
            missing.append(href)
    elif not urlsplit(href).scheme and not href.startswith('//'):
        path = unquote(urlsplit(href).path)
        if not (root / path).exists():
            missing.append(href)
print('sections:', ', '.join(sorted(check.ids & {'home','latest-news','publications','awards','service'})))
print('HCL project:', (root / 'project/HCL/index.html').exists())
print('broken local links:', missing)
print('HTML structure errors:', check.errors[:10], 'total', len(check.errors))
print('unclosed tags:', check.stack)
