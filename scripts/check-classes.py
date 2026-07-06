import re, glob, pathlib

css = pathlib.Path('assets/site.css').read_text(encoding='utf-8')
classes = set()
for f in glob.glob('*.html'):
    for m in re.findall(r'class="([^"]*)"', pathlib.Path(f).read_text(encoding='utf-8')):
        classes.update(m.split())

# our own custom (non-Tailwind) classes live verbatim in the CSS or are behavioural
custom = {'grain','btn','btn-primary','btn-ghost','btn-dark','reveal','streak-line','eyebrow',
          'display-hero','section-title','hero-bg','faq-item','faq-q','faq-body','faq-plus',
          'toggle-knob','check','check-light','legal-list','legal-item','mobile-link','price',
          'price-period','price-note','price-feat','in','open','scrolled','billing-annual'}

specials = set(':/[]().!%,')
def escape(cls):
    out = []
    for ch in cls:
        if ch in specials:
            out.append('\\' + ch)
        else:
            out.append(ch)
    return '.' + ''.join(out)

missing = []
for c in sorted(classes):
    if c in custom or c.split(':')[-1] in custom:
        continue
    if escape(c) not in css:
        missing.append(c)

print('total unique classes:', len(classes))
print('missing count:', len(missing))
for m in missing:
    print('   MISSING:', m)
